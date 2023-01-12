const app = Vue.createApp({
    data() {
        return {
            name: 'Bulbasaur',
            //art: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            type: ['grass', 'poison'],
            typeMap: this.initMap(new Map()),
            typeImages:[
                {
                    imageURL: './types/Grass.jpeg'
                },
                {
                    imageURL: './types/Poison.jpeg'
                },
            ],
        }
    },
    methods: {
        async randomPokemon() {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
            const allPokemon = await res.json()
                                                                                    // This handles additions and deletions to the api
            const choice = Math.floor(Math.random() * allPokemon.results.length);

            const finalRes = await fetch(allPokemon.results[choice].url) 
            const randomPokemon = await finalRes.json()

            let randomName = randomPokemon.name
            this.name = randomName.charAt(0).toUpperCase() + randomName.slice(1); // Capitalizes First Letter.
            //this.art = randomPokemon.sprites.other.official-artwork.front_default
            this.sprite = randomPokemon.sprites.front_default

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
                map.set('bug', "./types/Bug.jpeg")
                map.set('dark', "./types/Dark.jpeg")
                map.set('dragon', "./types/Dragon.jpeg")
                map.set('electric', "./types/Electric.jpeg")
                map.set('fairy', "./types/Fairy.jpeg")
                map.set('fighting', "./types/Fight.jpeg")
                map.set('fire', "./types/Fire.jpeg")
                map.set('flying', "./types/Flying.jpeg")
                map.set('ghost', "./types/Ghost.jpeg")
                map.set('grass', "./types/Grass.jpeg")
                map.set('ground', "./types/Ground.jpeg")
                map.set('ice', "./types/Ice.jpeg")
                map.set('normal', "./types/Normal.jpeg")
                map.set('poison', "./types/Poison.jpeg")
                map.set('psychic', "./types/Psychic.jpeg")
                map.set('rock', "./types/Rock.jpeg")
                map.set('steel', "./types/Steel.jpeg")
                map.set('water', "./types/Water.jpeg")
                return map
        }
    }
})

app.mount('#app')
