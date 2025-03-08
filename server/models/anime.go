package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Image struct for storing image URLs
type Image struct {
	ImageURL      string `bson:"image_url"`
	SmallImageURL string `bson:"small_image_url"`
	LargeImageURL string `bson:"large_image_url"`
}

// Images struct holding JPG and WEBP formats
type Images struct {
	JPG  Image `bson:"jpg"`
	WebP Image `bson:"webp"`
	PNG  Image `bson:"png"`
}

// Title struct for different title types
type Title struct {
	Type  string `bson:"type"`
	Title string `bson:"title"`
}

// Anime struct representing the document structure
type Anime struct {
	ID       primitive.ObjectID `bson:"_id"`
	Slug     string             `bson:"slug"`
	Images   Images             `bson:"images"`
	Titles   []Title            `bson:"titles"`
	Synopsis string             `bson:"synopsis"`
}
