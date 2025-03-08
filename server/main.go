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
	//router.StaticFile("/", "./frontend/build/index.html")
	// router.StaticFile("/favicon.ico", "./frontend/build/favicon.ico")
	// router.StaticFile("/manifest.json", "./frontend/build/manifest.json")
	router.NoRoute(routers.DefaultRouter)
	port := os.Getenv("PORT")
	router.Run(":" + port)
}
