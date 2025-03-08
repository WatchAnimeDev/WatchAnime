package routers

import (
	"context"
	"fmt"
	"go-gin-react-app/database"
	"go-gin-react-app/helper"
	"go-gin-react-app/models"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func DefaultRouter(c *gin.Context) {
	collection := database.GetCollection(os.Getenv("ANIME_INFO_COLLECTION_NAME"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	requestedPath := c.Request.URL.Path // Get the requested route path
	re := regexp.MustCompile(`^/anime/([^/]+)/`)
	match := re.FindStringSubmatch(requestedPath)
	var slug string
	if len(match) > 1 {
		slug = match[1]
	} else {
		c.File(os.Getenv("INDEX_FILE_PATH") + "index.html")
		return
	}
	// Query condition - find document with slug
	filter := bson.M{"slug": slug}
	var anime models.Anime
	err := collection.FindOne(ctx, filter).Decode(&anime)
	if err != nil {
		c.File(os.Getenv("INDEX_FILE_PATH") + "index.html")
		return
	}

	imageUrl := helper.GetImageUrl(anime.Images.JPG)
	defaultTitle := helper.GetAnimeDefaultTitle(anime.Titles, anime.Slug)

	// Read the index.html file
	content, err := os.ReadFile(os.Getenv("INDEX_FILE_PATH") + "index.html")
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to load index.html")
		return
	}
	// Convert content to string
	htmlContent := string(content)
	if defaultTitle != "" {
		htmlContent = strings.ReplaceAll(htmlContent, `<meta property="og:title" content="Watch Anime Ad Free"/>`, fmt.Sprintf(`<meta property="og:title" content="%s" />`, defaultTitle))
	}
	if imageUrl != "" {
		htmlContent = strings.ReplaceAll(htmlContent, `<meta property="og:image" content="/favicon/android-chrome-512x512.png"/>`, fmt.Sprintf(`<meta property="og:image" content="%s" />`, imageUrl))
	}
	if anime.Synopsis != "" {
		htmlContent = strings.ReplaceAll(htmlContent, `<meta property="og:description" content="Watch anime ad free with friends!"/>`, fmt.Sprintf(`<meta property="og:description" content="%s" />`, anime.Synopsis))
	}
	// Send the modified HTML response
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(htmlContent))
	//userAgent := c.Request.UserAgent()
}
