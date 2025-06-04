package main

import (
	"encoding/json"
	"net/http"
)

type Item struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Price int    `json:"price"`
}

var items = []Item{
	{1, "Товар 1", 100},
	{2, "Товар 2", 200},
	{3, "Товар 3", 300},
}

func itemsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(items)
	} else if r.Method == http.MethodPost {
		var newItem Item
		json.NewDecoder(r.Body).Decode(&newItem)
		newItem.ID = len(items) + 1
		items = append(items, newItem)
		json.NewEncoder(w).Encode(newItem)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/items", itemsHandler)
	http.ListenAndServe(":8080", nil)
}
