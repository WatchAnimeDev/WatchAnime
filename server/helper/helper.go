package helper

import (
	"go-gin-react-app/models"
	"strings"
)

func GetImageUrl(image models.Image) string {
	if image.LargeImageURL != "" {
		return image.LargeImageURL
	}
	if image.ImageURL != "" {
		return image.ImageURL
	}
	if image.SmallImageURL != "" {
		return image.SmallImageURL
	}
	return ""
}

func GetAnimeDefaultTitle(titles []models.Title, slug string) string {
	var defaultTitle string

	for _, title := range titles {
		if title.Type == "Default" {
			defaultTitle = title.Title
			break
		}
	}
	if defaultTitle == "" {
		return ""
	}
	// Append (DUB) if it's a dubbed title
	if strings.HasSuffix(slug, "-dub") {
		defaultTitle += " (DUB)"
	}
	return defaultTitle
}
