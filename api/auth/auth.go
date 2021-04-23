package auth

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hackclub/hack-as-a-service/db"
)

func EnsureAuthedUser(c *gin.Context) {
	token, err := c.Cookie("token")
	if err != nil {
		c.AbortWithStatusJSON(401, gin.H{"status": "error", "message": "not_authed"})
		return
	}

	var db_token db.Token
	result := db.DB.Where("token = ?", token).First(&db_token)
	if result.Error != nil {
		c.AbortWithStatusJSON(401, gin.H{"status": "error", "message": "not_authed"})
		return
	}

	// Check token expiry
	if time.Until(db_token.ExpiresAt) <= 0 {
		log.Println("Expiring token")

		// it should expire
		db.DB.Delete(&db_token)
		c.SetCookie("token", "", 0, "/", "", true, false)

		c.AbortWithStatusJSON(401, gin.H{"status": "error", "message": "not_authed"})
		return
	}

	// Get the user attached to a token
	var user db.User
	result = db.DB.First(&user, db_token.UserID)
	if result.Error != nil {
		c.AbortWithStatusJSON(401, gin.H{"status": "error", "message": "not_authed"})
		return
	}

	c.Set("user", user)

	c.Next()
}
