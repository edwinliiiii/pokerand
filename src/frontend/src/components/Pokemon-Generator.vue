<template>
    <div style="display:flex; flex-direction: column;">
    <!-- Generator Section -->
    <div class="generator">
    <img class="sprite" :src="sprite" :alt="name"/>
    <h1 class="name"> {{name}} </h1>
    <div class="row-types"><img v-for="item in typeImages" :key="item.imageURL" :src="item.imageURL" class="typeImage"/></div>
    <div class="col-buttons"><button class="genButton" v-on:click="randomPokemon()"> Generate Random </button>
    <button class="addButton" v-on:click="addPokemon()"> Add to Team </button>
</div>
    <br><br><hr><br><br>
    </div>

    <!-- Collected Section -->
    <p class="error" v-if="error">{{ error }}</p>
    <div class="collect-container">
        <div style="display:flex; flex-direction:row"
            v-for="(poke, index) in collected"
            v-bind:item="poke"
            v-bind:index="index"
            v-bind:key="poke._id">

            <div class="collect">

                <img class="collect-sprite" :src="poke.sprite" :alt="name"/>

                <div style="display:flex; flex-direction: column; align-items: center; margin-top: 7px">
                    <p class="collect-name"> {{ poke.name }}</p>
                    <img v-for="item in poke.typeImages" :key="item.imageURL" :src="item.imageURL" class="collect-typeImage"/>
                </div>

            </div>

            <button class="button-4" role="botton" v-on:click="deletePokemon(poke._id)"> Delete </button>

        </div>

    </div>
    </div>
</template>

<script>
import CollectService from '../CollectService'
import RandomService from '../RandomService'
const grassImage = require('../assets/types/Grass.jpeg')
const poisonImage = require('../assets/types/Poison.jpeg')
const fireImage = require('../assets/types/Fire.jpeg')
const waterImage = require('../assets/types/Water.jpeg')
const groundImage = require('../assets/types/Ground.jpeg')
const rockImage = require('../assets/types/Rock.jpeg')
const steelImage = require('../assets/types/Steel.jpeg')
const psychicImage = require('../assets/types/Psychic.jpeg')
const darkImage = require('../assets/types/Dark.jpeg')
const fairyImage = require('../assets/types/Fairy.jpeg')
const fightingImage = require('../assets/types/Fight.jpeg')
const normalImage = require('../assets/types/Normal.jpeg')
const ghostImage = require('../assets/types/Ghost.jpeg')
const iceImage = require('../assets/types/Ice.jpeg')
const bugImage = require('../assets/types/Bug.jpeg')
const dragonImage = require('../assets/types/Dragon.jpeg')
const electricImage = require('../assets/types/Electric.jpeg')
const flyingImage = require('../assets/types/Flying.jpeg')
const notFound = require('../assets/pokeNotFound.png')

export default {
    // containing our data. could be better abstracted 
    // into Pokemon objects, but we can just utilize fields 
    // of the current statebelow.
    data() {
        return {
            name: 'Bulbasaur',
            //art: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            type: ['grass', 'poison'],
            typeMap: this.initMap(new Map()),
            typeImages:[
                {
                    imageURL: grassImage
                },
                {
                    imageURL: poisonImage
                },
            ],
            collected: [],
            error: '',
        }
    },
    // on initialization
    async created() {
        try {
            this.collected = await CollectService.getCollection()
            this.collected = this.collected.reverse()
        } catch(err) {
            this.err = err.message
        }
    },
    // all methods
    methods: {
        async randomPokemon() {
            /*const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
            const allPokemon = await res.json() 
                                                                                            // This handles additions and deletions of Pokemon in the api as the list length may not always be constant
            const choice = Math.floor(Math.random() * allPokemon.results.length);

            const finalRes = await fetch(allPokemon.results[choice].url) 
            const randomPokemon = await finalRes.json() */

            const randomPokemonURL = await RandomService.getRandom()
            const randomPokemon = await (await fetch(randomPokemonURL)).json()
            let randomName = randomPokemon.name
            this.name = randomName.charAt(0).toUpperCase() + randomName.slice(1); // Capitalizes First Letter.
            //this.art = randomPokemon.sprites.other.official-artwork.front_default
            if (randomPokemon.sprites.front_default == null) {
              this.sprite = notFound
            } else {
              this.sprite = randomPokemon.sprites.front_default
            } 

            // handling types
            this.type = []
            for (let i = 0; i < randomPokemon.types.length; i++) {
                this.type.push(randomPokemon.types[i].type.name)
            }
            
            this.adjustTypeImages()  // handles updating type Images
        },
        adjustTypeImages() {
            this.typeImages = []
            for (let i = 0; i < this.type.length; i++) {
                this.typeImages.push({ imageURL: this.typeMap.get(this.type[i])})
            }
        },
        initMap(map) {
                map.set('bug', bugImage)
                map.set('dark', darkImage)
                map.set('dragon', dragonImage)
                map.set('electric', electricImage)
                map.set('fairy', fairyImage)
                map.set('fighting', fightingImage)
                map.set('fire', fireImage)
                map.set('flying', flyingImage)
                map.set('ghost', ghostImage)
                map.set('grass', grassImage)
                map.set('ground', groundImage)
                map.set('ice', iceImage)
                map.set('normal', normalImage)
                map.set('poison', poisonImage)
                map.set('psychic', psychicImage)
                map.set('rock', rockImage)
                map.set('steel', steelImage)
                map.set('water', waterImage)
                return map
        },
        async addPokemon() {
            if (this.collected.length + 1 > 6) {
                this.error = "Error: Teams have 6 Pokemon capacity."
                return
            }

            await CollectService.insertPoke(this.name, this.sprite, this.type, this.typeImages)
            this.collected = await CollectService.getCollection()
            this.collected = this.collected.reverse()
        },
        async deletePokemon(id) {
            await CollectService.deletePoke(id)
            this.collected = await CollectService.getCollection()
            this.collected = this.collected.reverse()
            if (this.collected.length - 1 <= 6) {
                this.error=''
            }
        }
    }
}
</script>

<style scoped>
#app1 {
    width: 100px;
    height: 100px;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.name {
    margin-left: 17px;
    max-width: 350px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    align-items: center;
}

.art {
    width: 200px;
    height: 200px;
    align-items: center;
}

.sprite {
    width: 200px;
    height: 200px;
    align-items: center;
    outline-style: solid;
    outline: 2px;
    margin-top: 10px;
}

.typeImage {
    margin: 5px;
    margin-bottom: 15px;
}

.teamTitle {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    align-items: center;
    flex-direction: column;
}

div.container { max-width: 800px; margin: 0 auto; }

p.error { border: 1px solid #ff5b5f; background-color: #ffc5c1; padding: 10px; margin-bottom: 15px; }

div.collect { position: relative; border: 1px solid darkgray; background-color: lightblue; padding: 10px 10px 30px 10px; margin-bottom: 15px; }

/*div.created-at { position: absolute; top: 0; left: 0; padding: 5px 15px 5px 15px; background-color: lightblue; } */

p.text { font-size: 22px; font-weight: 700; margin-bottom: 0; }

.genButton {
  width: 150px;
  height: 35px;
  margin:auto;
  padding:auto;
  background-color:orangered;
}
.addButton {
  width: 150px;
  height: 35px;
  margin:auto;
  padding:auto;
  background-color:lightgray;
}

.col-buttons {
    width: 150px;
    height: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: auto;
}

.row {
    width: 300px;
    height:100px;
    border: 1px solid black;
    border-collapse: collapse;
    align-items: center;
}

.collect-name {
    align-items: center;
    justify-content: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    width: 150px;
}

.collect-sprite {
    margin-top: 10px;
    margin-left: 15px;
    width: 150px;
    height: auto
}

.collect-container {
    position: relative;
}

.collect-typeImage {
    width: 65px;
    height:auto;
   /*padding-bottom:8px; */
}

.collect {
    width: 250px;
    height: 100px;
    position: relative;
    display: flex;
    flex-direction: row;
}

/* CSS */
.button-4 {
    width: 80px;
    height: 30px;
  appearance: none;
  background-color: #FAFBFC;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #24292E;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 14px;
  font-weight: 500;
  line-height: 10px;
  text-align: center;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
  margin:auto;
  padding:auto;
  margin-left: 35px;
  margin-top: 50px;
}

.button-4:hover {
  background-color: #F3F4F6;
  text-decoration: none;
  transition-duration: 0.1s;
}

.button-4:disabled {
  background-color: #FAFBFC;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959DA5;
  cursor: default;
}

.button-4:active {
  background-color: #EDEFF2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}

.button-4:focus {
  outline: 1px transparent;
}

.button-4:before {
  display: none;
}

.button-4:-webkit-details-marker {
  display: none;
}
</style>
