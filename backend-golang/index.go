package main

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jasonlvhit/gocron"
	"github.com/minio/minio-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const MONGO_DB_ENDPOINT = "mongo"

// const MONGO_DB_ENDPOINT = "23.101.23.85"
const MONGO_DB_PORT = 27017

const MINIO_ENDPOINT = "minio"

// const MINIO_ENDPOINT = "minio.southindiantrekkers.org"
const MINIO_ENABLE_SECURE = false
const MINIO_ACCESS_KEY = "minio"
const MINIO_SECET_KEY = "minio123"

type Feedback struct {
	Id       string  `json:"_id" bson:"_id,omitempty"`
	Name     string  `json:"name"`
	Rating   float32 `json:"rating"`
	Feedback string  `json:"feedback"`
}

type ServerLog struct {
	Time     string `json:"time"`
	FileName string `json:"fileName"`
	Etag     string `json:"etag"`
}

func getConnectionInstance() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://" + MONGO_DB_ENDPOINT + ":27017"))
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	return client
}
func getMinioClient() *minio.Client {
	endpoint := MINIO_ENDPOINT
	accessKeyID := MINIO_ACCESS_KEY
	secretAccessKey := MINIO_SECET_KEY
	useSSL := false
	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, accessKeyID, secretAccessKey, useSSL)
	if err != nil {
		log.Fatalln(err)
	}
	return minioClient
}
func getFeedbackCollectionInstance(client *mongo.Client) *mongo.Collection {
	collection := client.Database("test").Collection("feedbacks")
	return collection
}
func insertIntoFeedbackCollection(collection *mongo.Collection, feedback Feedback) *mongo.InsertOneResult {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	res, _ := collection.InsertOne(ctx, bson.M{"feedback": feedback.Feedback,
		"name":   feedback.Name,
		"rating": feedback.Rating})
	return res
}
func getFeedbackCollections(collection *mongo.Collection) []Feedback {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)
	_feedbackList := make([]Feedback, 0)
	for cur.Next(ctx) {
		var feedback Feedback
		err := cur.Decode(&feedback)
		_feedbackList = append(_feedbackList, feedback)
		if err != nil {
			log.Fatal(err)
		}
	}
	return _feedbackList
}
func getLogCollectionInstance(client *mongo.Client) *mongo.Collection {
	collection := client.Database("test").Collection("logs")
	return collection
}
func insertIntoLogCollection(collection *mongo.Collection, serverLog ServerLog) *mongo.InsertOneResult {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	res, _ := collection.InsertOne(ctx, serverLog)
	return res
}
func getLogCollections(collection *mongo.Collection) []ServerLog {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(ctx)
	_serverLogList := make([]ServerLog, 0)
	for cur.Next(ctx) {
		var serverLog ServerLog
		err := cur.Decode(&serverLog)
		_serverLogList = append(_serverLogList, serverLog)
		if err != nil {
			log.Fatal(err)
		}
	}
	return _serverLogList
}
func appendFiles(filename string, zipw *zip.Writer) error {
	file, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("Failed to open %s: %s", filename, err)
	}
	defer file.Close()

	wr, err := zipw.Create(filename)
	if err != nil {
		msg := "Failed to create entry for %s in zip file: %s"
		return fmt.Errorf(msg, filename, err)
	}

	if _, err := io.Copy(wr, file); err != nil {
		return fmt.Errorf("Failed to write %s to zip: %s", filename, err)
	}

	return nil
}

func createMinioBucket(minioClient *minio.Client) {
	bucketName := "applogs"
	location := "us-east-1"
	err := minioClient.MakeBucket(bucketName, location)
	if err != nil {
		// Check to see if we already own this bucket (which happens if you run this twice)
		exists, errBucketExists := minioClient.BucketExists(bucketName)
		if errBucketExists == nil && exists {
			// log.Printf("We already own %s\n", bucketName)
		} else {
			log.Fatalln(err)
		}
	} else {
		// log.Printf("Successfully created %s\n", bucketName)
	}
}

func createZip(objectName string, filePath string) {
	flags := os.O_WRONLY | os.O_CREATE | os.O_TRUNC
	file, err := os.OpenFile(objectName, flags, 0644)
	if err != nil {
		log.Fatalf("Failed to open zip for writing: %s", err)
	}
	defer file.Close()
	zipw := zip.NewWriter(file)
	defer zipw.Close()
	if err := appendFiles(filePath, zipw); err != nil {
		log.Fatalf("Failed to add file %s to zip: %s", filePath, err)
	}
}
func pushLogsToMinio(objectName string) {
	minioClient := getMinioClient()
	createMinioBucket(minioClient)
	contentType := "application/zip"
	bucketName := "applogs"
	_, err := minioClient.FPutObject(bucketName, objectName, objectName, minio.PutObjectOptions{ContentType: contentType})
	if err != nil {
		log.Fatalln(err)
	}
	go func() {
		var serverLog ServerLog
		serverLog.Time = time.Now().UTC().String()[0:19]
		serverLog.FileName = objectName
		client := getConnectionInstance()
		insertIntoLogCollection(getLogCollectionInstance(client), serverLog)
	}()
	go func() {
		os.Remove(objectName)
		err = ioutil.WriteFile("access.log", []byte(""), 0644)
		if err != nil {
			panic(err)
		}
	}()
}
func schedlueHandler() {
	zipFileName := time.Now().UTC().String()[0:19] + " access.log.zip"
	zipFileName = strings.ReplaceAll(zipFileName, "/", "-")
	zipFileName = strings.ReplaceAll(zipFileName, ":", "-")
	zipFileName = strings.ReplaceAll(zipFileName, " ", "-")
	go func() {
		createZip(zipFileName, "access.log")
	}()
	go func() {
		pushLogsToMinio(zipFileName)
	}()

}
func main() {
	fmt.Println()
	// Set the router as the default one shipped with Gin
	logFile, err := os.Create("access.log")
	if err != nil {
		panic(err)
	}
	go func() {
		gocron.Every(10).Seconds().Do(schedlueHandler)
		<-gocron.Start()
	}()
	gin.SetMode(gin.ReleaseMode)
	gin.DefaultWriter = io.MultiWriter(logFile, os.Stdout)
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("../frontend-react/build", true)))
	router.Use(static.Serve("/feedbacks", static.LocalFile("../frontend-react/build", true)))

	// Setup route group for the API
	api := router.Group("/db")
	{
		client := getConnectionInstance()
		collection := getFeedbackCollectionInstance(client)
		api.GET("/feedbacks", func(c *gin.Context) {

			c.JSON(http.StatusOK, getFeedbackCollections(collection))
		})
		api.POST("/feedbacks", func(c *gin.Context) {
			var feedback Feedback
			c.BindJSON(&feedback)
			res := insertIntoFeedbackCollection(collection, feedback)
			c.JSON(http.StatusOK, gin.H{"id": res.InsertedID})
		})

		api.GET("/logs", func(c *gin.Context) {
			c.JSON(http.StatusOK, getLogCollections(getLogCollectionInstance(client)))
		})
		api.POST("/logs", func(c *gin.Context) {
			var serverLog ServerLog
			c.BindJSON(&serverLog)
			res := insertIntoLogCollection(getLogCollectionInstance(client), serverLog)
			c.JSON(http.StatusOK, gin.H{"id": res.InsertedID})
		})
	}
	router.Run(":3000")
}
