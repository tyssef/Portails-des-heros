// app/javascript/controllers/backstory_controller.js
import { Controller } from "@hotwired/stimulus"
import { createConsumer } from "@rails/actioncable"

// Connects to data-controller="backstory"
export default class extends Controller {
  static targets = ["backstory", "picture"]
  static values = { characterId: Number }

  connect() {
    console.log("Backstory controller connected for character ID:", this.characterIdValue);

    if (!this.channel) {
      // Abonnement au canal ActionCable
      console.log("Connecting to ActionCable channel: CharacterChannel");
      this.channel = createConsumer().subscriptions.create(
        { channel: "CharacterChannel", character_id: this.characterIdValue }, {
        received: (data) => {
          console.log("Received data from ActionCable:", data);
          
          // Verify the character ID matches and that backstory is present
          if (data.character_id === this.characterIdValue) {
            this.updateCharacterBackstory(data);
          } else {
            console.log("Data received does not meet the required conditions.");
          }
        },
        connected: () => {
          console.log("Successfully connected to CharacterChannel for character ID:", this.characterIdValue);
        },
        disconnected: () => {
          console.log("Disconnected from CharacterChannel for character ID:", this.characterIdValue);
        }
      });

      console.log("Backstory controller fully set up for character ID:", this.characterIdValue);
    }
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
      console.log("Unsubscribed from CharacterChannel for character ID:", this.characterIdValue);
    }
  }

  updateCharacterBackstory(data) {
    console.log("Updating character backstory with data:", data);
  
    if (data.character_id === this.characterIdValue) {
      fetch(`/mes_personnages/${data.character_id}/backstory_partial`, {headers: {"Accept": "application/json"}})
        .then(response => response.json())
        .then(data => {
          this.backstoryTarget.innerHTML = data.html;
          this.pictureTarget.innerHTML = data.photo_url ? `<img src="${data.photo_url}" alt="Character Image" class="show-character-image" />` : '';
          console.log("Backstory updated successfully.");
        })
        .catch(error => {
          console.error("Error fetching backstory partial:", error);
        });
    } else {
      console.log("Received data for another character:", data.character_id);
    }
  }
}
