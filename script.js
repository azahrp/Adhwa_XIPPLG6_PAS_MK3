// Fungsi untuk menghasilkan angka acak dari 0 hingga max (tidak termasuk max)
function rand(max) {
  return Math.floor(Math.random() * max);
}

// Fungsi untuk mengacak urutan elemen dalam array a
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fungsi untuk mengubah kecerahan gambar sprite berdasarkan faktor yang diberikan
function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas");
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  var context = virtCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);
  var imgData = context.getImageData(0, 0, 500, 500);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  context.putImageData(imgData, 0, 0);
  var spriteOutput = new Image();
  spriteOutput.src = virtCanvas.toDataURL();
  virtCanvas.remove();
  return spriteOutput;
}
  
  // Fungsi untuk menampilkan pesan kemenangan
function displayVictoryMess(moves) {
  document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
  toggleVisablity("Message-Container");  
}

// Fungsi untuk mengubah visibilitas elemen berdasarkan id
function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}

// Fungsi untuk membuat labirin
  function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
    };
  
    // Fungsi ini mengembalikan peta labirin (mazeMap).
this.map = function() {
  return mazeMap;
};

// Fungsi ini mengembalikan koordinat awal labirin (startCoord).
this.startCoord = function() {
  return startCoord;
};

// Fungsi ini mengembalikan koordinat akhir labirin (endCoord).
this.endCoord = function() {
  return endCoord;
};

// Fungsi genMap() digunakan untuk menginisialisasi peta labirin dengan ukuran yang diberikan (height x width).
function genMap() {
  mazeMap = new Array(height); // Inisialisasi array 2D untuk merepresentasikan peta labirin berdasarkan tinggi (height).
  for (y = 0; y < height; y++) {
    mazeMap[y] = new Array(width); // Inisialisasi setiap baris dalam peta labirin dengan lebar (width).
    for (x = 0; x < width; ++x) {
      mazeMap[y][x] = { // Setiap sel dalam peta labirin diatur dengan properti sebagai berikut:
        n: false,       // Boolean untuk menandai apakah ada dinding ke utara (north).
        s: false,       // Boolean untuk menandai apakah ada dinding ke selatan (south).
        e: false,       // Boolean untuk menandai apakah ada dinding ke timur (east).
        w: false,       // Boolean untuk menandai apakah ada dinding ke barat (west).
        visited: false, // Boolean untuk menandai apakah sel sudah dikunjungi atau belum.
        priorPos: null  // Menyimpan posisi sebelumnya untuk keperluan navigasi.
      };
    }
  }
}
  
function defineMaze() {
  var isComp = false; // Menandakan apakah pembuatan labirin telah selesai
  var move = false; // Menandakan apakah terjadi pergerakan dari satu sel ke sel lainnya
  var cellsVisited = 1; // Jumlah sel yang telah dikunjungi (dimulai dari 1 karena sel awal sudah dikunjungi)
  var numLoops = 0; // Jumlah iterasi dalam satu langkah penelusuran
  var maxLoops = 0; // Jumlah maksimum iterasi yang diizinkan dalam satu langkah penelusuran
  var pos = { // Variabel posisi saat ini dalam labirin (koordinat x dan y)
    x: 0,
    y: 0
  };
  var numCells = width * height; // Total jumlah sel dalam labirin

  // Iterasi untuk membangun labirin sampai kondisi selesai (isComp = true)
  while (!isComp) {
    move = false; // Set ulang status pergerakan

    mazeMap[pos.x][pos.y].visited = true; // Tandai sel saat ini sebagai sudah dikunjungi

    // Jika jumlah iterasi mencapai batas maksimum, acak urutan arah pergerakan
    if (numLoops >= maxLoops) {
      shuffle(dirs); // Acak urutan arah pergerakan
      maxLoops = Math.round(rand(height / 8)); // Tentukan ulang jumlah iterasi maksimum
      numLoops = 0; // Set ulang jumlah iterasi
    }
    numLoops++; // Tambah jumlah iterasi

    // Loop melalui semua arah pergerakan yang mungkin
    for (index = 0; index < dirs.length; index++) {
      var direction = dirs[index]; // Arah pergerakan saat ini
      var nx = pos.x + modDir[direction].x; // Koordinat x untuk arah pergerakan yang dihitung
      var ny = pos.y + modDir[direction].y; // Koordinat y untuk arah pergerakan yang dihitung

      // Periksa apakah koordinat tersebut masih dalam batas labirin
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        // Periksa apakah sel berikutnya belum dikunjungi
        if (!mazeMap[nx][ny].visited) {
          // 'Carve' atau buat jalan dari sel saat ini ke sel berikutnya dalam arah yang dipilih
          mazeMap[pos.x][pos.y][direction] = true; // Tandai arah dari sel saat ini
          mazeMap[nx][ny][modDir[direction].o] = true; // Tandai arah dari sel berikutnya berdasarkan arah yang dipilih

          // Atur sel saat ini sebagai sel sebelumnya dari sel berikutnya
          mazeMap[nx][ny].priorPos = pos;
          // Perbarui posisi saat ini ke lokasi yang baru dikunjungi
          pos = {
            x: nx,
            y: ny
          };
          cellsVisited++; // Tambah jumlah sel yang telah dikunjungi
          move = true; // Set status pergerakan menjadi true
          break; // Hentikan loop, lanjut ke sel berikutnya
        }
      }
    }

    // Jika tidak terjadi pergerakan, maka kembali ke sel sebelumnya
    if (!move) {
      pos = mazeMap[pos.x][pos.y].priorPos;
    }

    // Jika jumlah sel yang telah dikunjungi sama dengan total sel dalam labirin, selesai
    if (cellsVisited === numCells) {
      isComp = true; // Set kondisi selesai menjadi true
    }
  }
}
 
//untuk menentukan posisi awal (startCoord) dan posisi akhir (endCoord) dalam labirin
function defineStartEnd() {
  // Menggunakan fungsi rand(4) untuk menghasilkan angka acak antara 0 hingga 3
  switch (rand(4)) {
    case 0:
      // Kondisi 0: Menentukan posisi awal di pojok kiri atas dan posisi akhir di pojok kanan bawah labirin
      startCoord = { x: 0, y: 0 };
      endCoord = { x: height - 1, y: width - 1 };
      break;
    case 1:
      // Kondisi 1: Menentukan posisi awal di pojok kanan atas dan posisi akhir di pojok kiri bawah labirin
      startCoord = { x: 0, y: width - 1 };
      endCoord = { x: height - 1, y: 0 };
      break;
    case 2:
      // Kondisi 2: Menentukan posisi awal di pojok kiri bawah dan posisi akhir di pojok kanan atas labirin
      startCoord = { x: height - 1, y: 0 };
      endCoord = { x: 0, y: width - 1 };
      break;
    case 3:
      // Kondisi 3: Menentukan posisi awal di pojok kanan bawah dan posisi akhir di pojok kiri atas labirin
      startCoord = { x: height - 1, y: width - 1 };
      endCoord = { x: 0, y: 0 };
      break;
  }
}

  
genMap(); // Memanggil fungsi untuk menginisialisasi peta labirin
defineStartEnd(); // Memanggil fungsi untuk menentukan posisi awal dan akhir dalam labirin
defineMaze(); // Memanggil fungsi untuk membuat labirin
  }
  //menggambar visualisasi labirin pada elemen <canvas>
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map(); // Mengambil peta labirin dari objek Maze
  var cellSize = cellsize; // Ukuran sel dalam piksel untuk menggambar labirin
  var drawEndMethod; // Fungsi untuk menggambar posisi akhir labirin

  // Mengatur ketebalan garis untuk menggambar batas sel dalam labirin
  ctx.lineWidth = cellSize / 40;

  // Fungsi untuk menggambar ulang labirin dengan ukuran sel yang berbeda
  this.redrawMaze = function(size) {
    cellSize = size; // Mengatur ulang ukuran sel untuk menggambar ulang labirin
    ctx.lineWidth = cellSize / 50; // Mengatur ketebalan garis untuk ukuran sel yang berbeda
    drawMap(); // Memanggil fungsi untuk menggambar ulang peta labirin
    drawEndMethod(); // Memanggil fungsi untuk menggambar posisi akhir labirin
  };

  // Fungsi internal untuk menggambar setiap sel dalam labirin
  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize; // Koordinat x dalam piksel untuk sel saat ini
    var y = yCord * cellSize; // Koordinat y dalam piksel untuk sel saat ini
    ctx.strokeStyle = "#FFFFFF"; // Warna garis untuk menggambar batas sel
  
      // Menggambar dinding atas sel
  if (cell.n == false) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + cellSize, y);
    ctx.stroke();
  }
  // Menggambar dinding bawah sel
  if (cell.s === false) {
    ctx.beginPath();
    ctx.moveTo(x, y + cellSize);
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.stroke();
  }
  // Menggambar dinding kanan sel
  if (cell.e === false) {
    ctx.beginPath();
    ctx.moveTo(x + cellSize, y);
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.stroke();
  }
  // Menggambar dinding kiri sel
  if (cell.w === false) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + cellSize);
    ctx.stroke();
  }
}

// Fungsi drawMap akan melintasi setiap sel dalam peta labirin dan memanggil drawCell untuk menggambar sel tersebut.
function drawMap() {
  for (x = 0; x < map.length; x++) {
    for (y = 0; y < map[x].length; y++) {
      drawCell(x, y, map[x][y]);
    }
  }
}
  
    // Fungsi untuk menggambar bendera sebagai penanda akhir labirin
function drawEndFlag() {
  var coord = Maze.endCoord(); // Mendapatkan koordinat akhir labirin
  var gridSize = 4; // Jumlah kotak yang akan digunakan untuk menampilkan bendera
  var fraction = cellSize / gridSize - 2; // Ukuran setiap kotak dalam piksel
  var colorSwap = true; // Variabel untuk berganti-ganti warna

  // Iterasi untuk menggambar kotak-kotak berganti-ganti warna
  for (let y = 0; y < gridSize; y++) {
    if (gridSize % 2 == 0) { // Jika jumlah kotak genap, ubah warna di setiap baris
      colorSwap = !colorSwap;
    }
    for (let x = 0; x < gridSize; x++) {
      ctx.beginPath();
      ctx.rect(
        coord.x * cellSize + x * fraction + 4.5,
        coord.y * cellSize + y * fraction + 4.5,
        fraction,
        fraction
      );
      // Mengatur warna kotak bergantian antara hitam dan putih
      if (colorSwap) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Warna hitam
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Warna putih
      }
      ctx.fill();
      colorSwap = !colorSwap; // Ubah warna untuk kotak selanjutnya
    }
  }
}

// Fungsi untuk menggambar penanda akhir labirin menggunakan gambar sprite
function drawEndSprite() {
  var offsetLeft = cellSize / 50; // Jarak gambar sprite dari tepi kiri dan atas sel
  var offsetRight = cellSize / 25; // Jarak gambar sprite dari tepi kanan dan bawah sel
  var coord = Maze.endCoord(); // Mendapatkan koordinat akhir labirin

  // Menggambar gambar sprite pada koordinat akhir labirin dengan ukuran yang disesuaikan
  ctx.drawImage(
    endSprite,
    2,
    2,
    endSprite.width,
    endSprite.height,
    coord.x * cellSize + offsetLeft,
    coord.y * cellSize + offsetLeft,
    cellSize - offsetRight,
    cellSize - offsetRight
  );
}

// Fungsi untuk membersihkan area canvas dari konten yang ada
function clear() {
  var canvasSize = cellSize * map.length; // Ukuran canvas
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Menghapus konten canvas
}

// Penentuan metode gambar untuk penanda akhir labirin berdasarkan ketersediaan endSprite
if (endSprite != null) {
  drawEndMethod = drawEndSprite; // Jika endSprite tersedia, gunakan drawEndSprite
} else {
  drawEndMethod = drawEndFlag; // Jika tidak, gunakan drawEndFlag
}

clear(); // Membersihkan canvas
drawMap(); // Menggambar peta labirin
drawEndMethod(); // Menggambar penanda akhir labirin menggunakan metode yang telah ditentukan
}
  //mengontrol pemain dalam labirin
  function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d"); // Mendapatkan konteks gambar 2D dari elemen <canvas>
    var drawSprite;
    var moves = 0;
  
    // Memilih jenis penggambaran pemain berdasarkan ketersediaan sprite
    drawSprite = drawSpriteCircle; // Secara default, pemain digambar dengan lingkaran
    if (sprite != null) {
      drawSprite = drawSpriteImg; // Jika sprite tersedia, pemain digambar menggunakan gambar
    }
  
    var player = this;
    var map = maze.map();
    var cellCoords = {
      x: maze.startCoord().x,
      y: maze.startCoord().y
    };
    var cellSize = _cellsize; // Ukuran sel dalam piksel
    var halfCellSize = cellSize / 2; // Setengah dari ukuran sel
  
    // Metode untuk menggambar ulang pemain dengan ukuran sel yang berbeda
    this.redrawPlayer = function(_cellsize) {
      cellSize = _cellsize; // Mengatur ulang ukuran sel
      drawSpriteImg(cellCoords); // Menggambar ulang pemain dengan gambar (jika ada)
    };
  
    // Fungsi untuk menggambar pemain sebagai lingkaran
    function drawSpriteCircle(coord) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(
        (coord.x + 1) * cellSize - halfCellSize,
        (coord.y + 1) * cellSize - halfCellSize,
        halfCellSize - 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      // Memeriksa apakah pemain berada di posisi akhir labirin
      if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
        onComplete(moves); // Memanggil fungsi onComplete jika pemain mencapai tujuan
        player.unbindKeyDown(); // Melepaskan event listener untuk mengontrol pemain
      }
    }
  
    // Fungsi untuk menggambar gambar sprite (gambar pemain) pada koordinat tertentu di dalam labirin
function drawSpriteImg(coord) {
  var offsetLeft = cellSize / 50; // Menentukan jarak gambar dari tepi kiri dan atas sel
  var offsetRight = cellSize / 25; // Menentukan jarak gambar dari tepi kanan dan bawah sel

  // Menggambar gambar sprite pada koordinat pemain dengan ukuran yang disesuaikan
  ctx.drawImage(
    sprite, // Gambar sprite yang akan digambar
    0,
    0,
    sprite.width,
    sprite.height,
    coord.x * cellSize + offsetLeft,
    coord.y * cellSize + offsetLeft,
    cellSize - offsetRight,
    cellSize - offsetRight
  );

  // Memeriksa apakah koordinat pemain sama dengan koordinat akhir labirin
  if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
    onComplete(moves); // Memanggil fungsi onComplete jika pemain mencapai tujuan akhir labirin
    player.unbindKeyDown(); // Melepaskan event listener untuk mengontrol gerakan pemain
  }
}

// Fungsi untuk menghapus gambar sprite (gambar pemain) dari posisi tertentu di dalam labirin
function removeSprite(coord) {
  var offsetLeft = cellSize / 50; // Menentukan jarak gambar dari tepi kiri dan atas sel
  var offsetRight = cellSize / 25; // Menentukan jarak gambar dari tepi kanan dan bawah sel

  // Menghapus gambar sprite pada koordinat pemain dari elemen canvas
  ctx.clearRect(
    coord.x * cellSize + offsetLeft,
    coord.y * cellSize + offsetLeft,
    cellSize - offsetRight,
    cellSize - offsetRight
  );
}
  
function check(e) {
  var cell = map[cellCoords.x][cellCoords.y]; // Mendapatkan sel saat ini berdasarkan koordinat cellCoords
  moves++; // Menginkrementasi jumlah langkah yang telah dilakukan
  
  // Menggunakan struktur switch-case untuk menentukan aksi berdasarkan tombol yang ditekan
  switch (e.keyCode) {
    case 65:
    case 37: // west / kiri
      if (cell.w == true) { // Jika arah barat (west) terbuka
        removeSprite(cellCoords); // Menghapus gambar pemain pada koordinat saat ini
        cellCoords = { // Memperbarui koordinat pemain ke arah barat
          x: cellCoords.x - 1,
          y: cellCoords.y
        };
        drawSprite(cellCoords); // Menggambar ulang gambar pemain pada koordinat baru
      }
      break;
    case 87:
    case 38: // north / utara
      if (cell.n == true) { // Jika arah utara (north) terbuka
        removeSprite(cellCoords); // Menghapus gambar pemain pada koordinat saat ini
        cellCoords = { // Memperbarui koordinat pemain ke arah utara
          x: cellCoords.x,
          y: cellCoords.y - 1
        };
        drawSprite(cellCoords); // Menggambar ulang gambar pemain pada koordinat baru
      }
      break;
    case 68:
    case 39: // east / timur
      if (cell.e == true) { // Jika arah timur (east) terbuka
        removeSprite(cellCoords); // Menghapus gambar pemain pada koordinat saat ini
        cellCoords = { // Memperbarui koordinat pemain ke arah timur
          x: cellCoords.x + 1,
          y: cellCoords.y
        };
        drawSprite(cellCoords); // Menggambar ulang gambar pemain pada koordinat baru
      }
      break;
    case 83:
    case 40: // south / selatan
      if (cell.s == true) { // Jika arah selatan (south) terbuka
        removeSprite(cellCoords); // Menghapus gambar pemain pada koordinat saat ini
        cellCoords = { // Memperbarui koordinat pemain ke arah selatan
          x: cellCoords.x,
          y: cellCoords.y + 1
        };
        drawSprite(cellCoords); // Menggambar ulang gambar pemain pada koordinat baru
      }
      break;
  }
}
  
    // Fungsi untuk mengaitkan event listener keyboard saat tombol ditekan
this.bindKeyDown = function() {
  // Menambahkan event listener untuk kejadian "keydown" pada window yang memanggil fungsi "check" saat tombol ditekan
  window.addEventListener("keydown", check, false);

  // Mengaktifkan penggunaan gesture swipe pada elemen dengan ID "view" menggunakan jQuery Mobile
  $("#view").swipe({
    swipe: function(
      event,
      direction,
      distance,
      duration,
      fingerCount,
      fingerData
    ) {
      console.log(direction); // Mencetak arah swipe pada konsol (hanya untuk debug)
      // Menggunakan gesture swipe untuk memanggil fungsi "check" dengan keyCode yang sesuai berdasarkan arah swipe
      switch (direction) {
        case "up":
          check({
            keyCode: 38 // keyCode 38 mengindikasikan arah atas (up)
          });
          break;
        case "down":
          check({
            keyCode: 40 // keyCode 40 mengindikasikan arah bawah (down)
          });
          break;
        case "left":
          check({
            keyCode: 37 // keyCode 37 mengindikasikan arah kiri (left)
          });
          break;
        case "right":
          check({
            keyCode: 39 // keyCode 39 mengindikasikan arah kanan (right)
          });
          break;
      }
    },
    threshold: 0 // Menentukan threshold atau ambang batas swipe (dalam piksel)
  });
};

// Fungsi untuk melepaskan event listener keyboard dan gesture swipe
this.unbindKeyDown = function() {
  window.removeEventListener("keydown", check, false); // Melepaskan event listener "keydown" pada window yang memanggil fungsi "check"
  $("#view").swipe("destroy"); // Menghentikan penggunaan gesture swipe pada elemen dengan ID "view"
};

drawSprite(maze.startCoord()); // Menggambar sprite pemain pada koordinat awal labirin

this.bindKeyDown(); // Memanggil fungsi untuk mengaitkan event listener keyboard dan gesture swipe
  }
  
  var mazeCanvas = document.getElementById("mazeCanvas"); // Mengambil elemen dengan ID "mazeCanvas" dari HTML
var ctx = mazeCanvas.getContext("2d"); // Mendapatkan konteks gambar 2D dari elemen canvas

var sprite; // Variabel untuk menyimpan gambar sprite
var finishSprite; // Variabel untuk menyimpan gambar penanda akhir (finish)

var maze, draw, player; // Variabel terkait objek yang akan dibuat
var cellSize; // Variabel untuk ukuran sel dalam labirin
var difficulty; // Variabel untuk tingkat kesulitan permainan

// sprite.src = 'media/sprite.png'; // Komentar: Mungkin awalnya ada rencana untuk mengatur sumber gambar sprite

window.onload = function() {
  // Mendapatkan lebar dan tinggi dari elemen dengan ID "view"
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();

  // Menentukan lebar dan tinggi elemen canvas (mazeCanvas) berdasarkan lebar dan tinggi dari "view"
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  // Pemuatan dan pengolahan sprites
  var completeOne = false; // Flag untuk menandai jika sprite pertama sudah selesai dimuat
  var completeTwo = false; // Flag untuk menandai jika sprite kedua sudah selesai dimuat

  var isComplete = () => { // Fungsi untuk memeriksa apakah kedua sprite sudah selesai dimuat
    if (completeOne === true && completeTwo === true) {
      console.log("Runs"); // Pesan untuk menandakan bahwa kondisi telah memenuhi syarat
      setTimeout(function(){
        makeMaze(); // Memanggil fungsi makeMaze setelah 500 milidetik (0.5 detik)
      }, 500);         
    }
  };

  sprite = new Image(); // Membuat objek Image untuk menyimpan gambar sprite
  sprite.src = "./klee.png" + "?" + new Date().getTime(); // Menentukan sumber gambar sprite dengan menambahkan parameter waktu
  sprite.setAttribute("crossOrigin", " "); // Mengatur akses gambar melalui crossOrigin untuk menghindari masalah keamanan
  sprite.onload = function() {
    sprite = changeBrightness(1.2, sprite); // Mengubah kecerahan gambar sprite
    completeOne = true; // Menandai bahwa sprite pertama telah selesai dimuat
    console.log(completeOne); // Menampilkan nilai completeOne (biasanya untuk tujuan debug)
    isComplete(); // Memeriksa apakah kondisi sudah memenuhi syarat untuk melanjutkan
  };

  // Pemuatan gambar penanda akhir (finishSprite) dan pengaturan kecerahan gambar
    finishSprite = new Image();
    finishSprite.src = "./house.png"+
    "?" +
    new Date().getTime();
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function() {
      finishSprite = changeBrightness(1.1, finishSprite);
      completeTwo = true; // Menandai bahwa gambar finishSprite telah selesai dimuat
      console.log(completeTwo);
      isComplete(); // Memeriksa kapan kondisi memenuhi syarat untuk melanjutkan
    };
    
  };
  // Event handler saat jendela browser diresize untuk menyesuaikan ukuran canvas dan sel
  window.onresize = function() {
    //Menyesuaikan ukuran canvas
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    //Menentukan ukuran sel berdasarkan lebar canvas dan tingkat kesulitan
    cellSize = mazeCanvas.width / difficulty;
    //Jika objek player ada, maka redraw maze dan player dengan ukuran sel yang baru
    if (player != null) {
      draw.redrawMaze(cellSize);
      player.redrawPlayer(cellSize);
    }
  };

  //Fungsi untuk membuat maze baru berdasarkan tingkat kesulitan yang dipilih
  function makeMaze() {
    if (player != undefined) { // Memeriksa apakah objek player sudah ada
      player.unbindKeyDown(); // Melepaskan event listener keydown dari objek player
      player = null; // Menghapus objek player
    }

    // Mengambil nilai tingkat kesulitan dari dropdown menu dengan ID "diffSelect"
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value; // Menyimpan nilai tingkat kesulitan yang dipilih
  
    // Menghitung ukuran sel berdasarkan lebar canvas dan tingkat kesulitan yang dipilih
    cellSize = mazeCanvas.width / difficulty;
  
    // Membuat objek Maze baru dengan tingkat kesulitan yang dipilih
    maze = new Maze(difficulty, difficulty);
  
    // Membuat objek DrawMaze baru dengan menggunakan objek Maze, konteks gambar 2D, ukuran sel, dan finishSprite
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  
    // Membuat objek Player baru dengan menggunakan objek Maze, elemen canvas maze, ukuran sel, fungsi displayVictoryMess, dan gambar sprite
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  
    // Jika opasitas elemen "mazeContainer" kurang dari 100%, atur opasitasnya menjadi 100%
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
  }
  
