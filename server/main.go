package main

import (
	"context"
	"go-gin-react-app/database"
	"go-gin-react-app/routers"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Task represents the MongoDB document structure
type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Description string             `bson:"description" json:"description"`
	Completed   bool               `bson:"completed" json:"completed"`
	Owner       primitive.ObjectID `bson:"owner" json:"owner"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	Version     int                `bson:"__v" json:"version"`
}

func main() {
	if os.Getenv("GIN_MODE") != "release" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	// Connect to MongoDB
	database.ConnectDB()
	defer database.Client.Disconnect(context.Background())
	router := gin.Default()

	// Serve the React build directory
	router.Static("/static", os.Getenv("INDEX_FILE_PATH")+"static")
	router.Static("/favicon", os.Getenv("INDEX_FILE_PATH")+"favicon")
	router.StaticFile("/asset-manifest.json", os.Getenv("INDEX_FILE_PATH")+"asset-manifest.json")
	router.StaticFile("/manifest.json", os.Getenv("INDEX_FILE_PATH")+"manifest.json")
	router.StaticFile("/serviceWorker.js", os.Getenv("INDEX_FILE_PATH")+"serviceWorker.js")
	router.StaticFile("/robots.txt", os.Getenv("INDEX_FILE_PATH")+"robots.txt")
	router.NoRoute(routers.DefaultRouter)
	port := os.Getenv("PORT")
	router.Run(":" + port)
}
