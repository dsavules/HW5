
var app = function() {

    var self = {};
    self.is_configured = false;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        v.map(function(e) {e._idx = k++;});
    };

    // Initializes an attribute of an array of objects.
    var set_array_attribute = function (v, attr, x) {
        v.map(function (e) {e[attr] = x;});
    };

    self.initialize = function () {
        document.addEventListener('deviceready', self.ondeviceready, false);
    };

    self.ondeviceready = function () {
        // This callback is called once Cordova has finished
        // its own initialization.
        console.log("The device is ready");
        $("#vue-div").show(); // This is jQuery.
        self.is_configured = true;
    };

    self.reset = function () {
        self.vue.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        self.vue.tile_color=[1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,2];
    };

    self.shuffle = function(row, col) {
        //element clicked position is row,col

         var x=0; var y=0;
        //find the empty element
         var empty = $('td:contains("16")');
         //find the empty element's position
         var emptycol = empty.index();
         var emptyrow = empty.parent().index();

         console.log("Shuffle:" + row + ", " + col+"EMPTY CELL AT "+emptyrow+" "+emptycol);
         var sum=Math.abs(emptycol - col) + Math.abs(emptyrow - row);
         console.log(emptyrow+ " " + row + " " + emptycol + " " +col+ "SUM IS "+sum);
         //if empy element next to clicked element
          if (Math.abs(emptycol - col) + Math.abs(emptyrow - row) == 1) {
          //swap board arrya elements as well as rhe array which holds the asociated colors
            x = self.vue.board[4*row+col];
            y=self.vue.tile_color[4*row+col];

            Vue.set(self.vue.board,4*row+col,self.vue.board[4*emptyrow+emptycol]);
            Vue.set(self.vue.tile_color,4*row+col,self.vue.tile_color[4*emptyrow+emptycol]);

           Vue.set(self.vue.board, 4*emptyrow+emptycol,x);
           Vue.set(self.vue.tile_color, 4*emptyrow+emptycol,y);
         }
         //return self;

    };

    self.scramble = function() {
        // Read the Wikipedia article.  If you just randomize,
        // the resulting puzzle may not be solvable.


    // If N  is even (4), puzzle instance is solvable if
    //---the blank is on an even row counting from the bottom (i is 0 or 2 in our case) and number of inversions is odd.
    //---the blank is on an odd row counting from the bottom (i is 1 or 3 in our case) and number of inversions is even.

       //shuffle the array first,


    do {
         // While there remain elements to shuffle…
         var m = self.vue.board.length;
         var t,i,c,j;
         while (m) {
           // Pick a remaining element…
           i = Math.floor(Math.random() * m--);
           // And swap it with the current element.
           t = self.vue.board[m];
           c = self.vue.tile_color[m];
           Vue.set(self.vue.board,m,self.vue.board[i]);
           Vue.set(self.vue.tile_color,m,self.vue.tile_color[i]);
           Vue.set(self.vue.board,i, t);
           Vue.set(self.vue.tile_color,i, c);
         }

        //check solvability
        //1. count inversions
        var inv_count = 0;
            for (i = 0; i < 15; i++)
            {
                for (j = i + 1; j < 16; j++)
                {
                    // count pairs(i, j) such that i appears before j, but i > j.
                    if (self.vue.board[i] > self.vue.board[j] ) {inv_count++;}
                }
            }

         //2. find position of blank element, searching from bottom up
         var rowindex;
          for (i = 3; i >= 0; i--)
                 for (j = 3; j >= 0; j--)
                     if (self.vue.board[4*i+j] == 16) {rowindex= 4 - i;}
         console.log("TOTAL INVERSIONS: ",inv_count, "EMPTY CELL ON ROW: ",rowindex+ " FROM BOTTOM");
         //check if solvability conditions are met
         if ((rowindex%2==0 && !(inv_count%2==0)) || (!(rowindex%2==0) && (inv_count%2==0)))
            {
             console.log("SOLVABLE");
             self.vue.flag=1;
             return self;
            }
         else {
                 console.log("THIS IS NOT SOLVABLE");
                  self.vue.flag=0;
                 //return self;
                }

        }while(!self.vue.flag);
    };


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            board: [],
            tile_color: [],
            flag: 0
        },
        methods: {
            reset: self.reset,
            shuffle: self.shuffle,
            scramble: self.scramble,
        }

    });

    self.reset();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){
    APP = app();
    APP.initialize();
});
