const vue = new Vue({
    el: '#app',
    data: {
        gameState
    },
    mounted() {
        document.querySelector('body').addEventListener('keydown',
            e => {
                if (e.keyCode === 13) {
                    this.gameStart();
                }
            }, false)
    },
    computed: {
        barWidth() {
            const tot = gameState.loadingProgress.itemsTotal;
            const cur = gameState.loadingProgress.itemsLoaded;
            return `${100*cur/tot}%`
        },
        readyToStart() {
            if (!gameState.loadingProgress.itemsTotal) {
                return false
            }
            return gameState.loadingProgress.itemsTotal === gameState.loadingProgress.itemsLoaded
        },
        accuracy() {
            const acc = Math.floor(100 * gameState.score / (gameState.miss + gameState.score));
            if (!acc) {
                return 0
            }
            return acc
        },
        finalScore() {
            return Math.floor(this.gameState.hp * 10 + this.gameState.score * 5 * this.accuracy * .01)
        },
        endingStory() {
            if (this.gameState.hp > 0) {
                return 'The rescue team arrive.  You leave the place and swear that you will never enter the forest again.'
            }
            return 'When the rescue team arrive, they see no survivor, but a victim be cruelly killed by some unknow creatures...'

        },
        showScore() {
            if (gameState.state === 'end') {
                return true
            }
            return false
        },
        showPanel() {
            if (gameState.state === 'playing') {
                return true
            }
            return false
        },
        loadingFile() {
            let s = gameState.loadingProgress.loadingUrl;
            if (!s) {
                return ''
            }
            const a = s.split('/');
            return a[a.length - 1]
        },
        scoreBoardTitle() {
            if (this.gameState.hp <= 0) {
                return 'Defeat...'
            }
            return 'Survive...'
        }
    },
    methods: {
        initializeGameState() {
            gameState.hp = 10;
            gameState.level = 1;
            gameState.score = 0;
            gameState.miss = 0;
            gameState.elaspedTime = 0;
            gameState.state = 'playing'
        },
        gameStart() {
            if (this.readyToStart === true && this.gameState.state != 'playing') {
                this.initializeGameState()
                this.gameState.startFunction();
            } else {
                console.log('not ready')
            }
        }
    }
})