// Sleep function for delay on loops
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Global DOM
const container = document.querySelector('.container');
const dBars = document.getElementById('dinamic-bars');
const tempBar = document.querySelector('.temp');
const nextValue = document.querySelector('.next-value');

const nbar = document.getElementById('n_bar');
const ndelay = document.getElementById('n_delay');
const nheight = document.getElementById('n_height');

const popup = document.querySelector('.popup');
const popupProgress = document.querySelector('.popup-progress-bar');
const popupText = document.querySelector('.popup-content-text');

// Global variables
var solving = false;
var showingBar = false;
var arrayToSort = [];
var bar_num = 20;
var height = 300;
var delay = 500;

/* 'parameters' section on HTML-CSS */
function changeNBar(e){
    bar_num = e.target.value;
    nbar.parentElement.firstElementChild.firstElementChild.textContent = e.target.value;
    randomizeBars();
}

function changeNHeight(e){
    //validation: 1 <= height <= 300
    if (e.target.value < 1)e.target.value = 1;
    if (e.target.value >300)e.target.value = 300;
    height = e.target.value;
    randomizeBars();
}
function changeNDelay(e){
    //validation: 1 <= delay <= 2000
    if (e.target.value < 1) e.target.value = 1;
    if (e.target.value >2000) e.target.value = 2000;
    delay = e.target.value;
}

/* Waiting for DOM Loaded */
document.addEventListener("DOMContentLoaded",()=>{randomizeBars();});

/* Show Popup if program is running; update progress bar & styles*/
function showPopup(error_msg){
    popup.classList.toggle('hidden');
    
    var width = 1;
    popupProgress.style.width = width + "%";
    popupText.innerHTML = error_msg;

    var i = 0;
    if (i == 0) {
        i = 1;
        var id = setInterval(frame, 30);
        function frame() {
        if (width >= 100) {
            clearInterval(id);
            i = 0;
            popup.classList.toggle('hidden');
            showingBar = false;
        } else {
            width++;
            popupProgress.style.width = width + "%";
        }
        }
    }
}

/* Randomize Button */
function randomizeBars(){

    if(!solving){
        // Clear HTML (visible bars) and arrayToSort (height values)
        dBars.innerHTML = '';
        arrayToSort = [];
        // CSS .container: min-height: 300px; -> Random height: 0 to 300
        for (let idx=0; idx < bar_num ; idx++){
            let rheight = Math.floor(Math.random() * height+1);
            let bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height= '0px';
            bar.style.height= String(rheight)+'px';
            dBars.appendChild(bar);
            arrayToSort.push(rheight);
        };
    }else{
        if (!showingBar){
            showingBar = true;
            let error_msg = "Sorry you can't <span>Randomize Bars</span>, the Algorithm is running!";
            setTimeout(showPopup(error_msg),100);
        }
    }
}


/* Run Button */
function run(){
    const sortMethod = document.getElementById('sort-type');

    if (!solving){
        solving = true;
        switch(sortMethod.value){
            case 'Bubble sort':
                bubbleSort();
                break;
            case 'Insertion sort':
                insertionSort();
                break;
        }
    }
    else{
        if (!showingBar){
            showingBar = true;
            let error_msg = "Sorry you can't <span>Run Again</span>, the Algorithm is running!";
            setTimeout(showPopup(error_msg),100);
        }    
    }
};

async function bubbleSort(){
    const barras = document.getElementsByClassName('bar');

    // "var(--green)" = "#65cb50eb"; // INDEX SELECCIONADO;
    // "var(--red)"= "#cb5f50eb"; // INDEX DE COMPARACIÓN;
    // "var(--yellow)" = "#cbc550eb"; // SWAP

    for(let i = 0; i < arrayToSort.length; i++){
        for(let j = 0; j < ( arrayToSort.length - i -1 ); j++){
            
            // First Value selected to compare -> green
            tempBar.style.height = arrayToSort[j]+"px";
            nextValue.style.height = arrayToSort[j+1]+"px";

            barras[j].style.backgroundColor = "var(--green)";
            await sleep(delay/4);
            // Second value selected to compare -> red
            barras[j+1].style.backgroundColor = "var(--red)";
            await sleep(delay/3);


            // SWAP
            if(arrayToSort[j] > arrayToSort[j+1]){
                
                // Swap values -> yellow
                barras[j].style.backgroundColor = "var(--yellow)";
                barras[j+1].style.backgroundColor = "var(--yellow)";
                await sleep(delay*1.25);

                // Swapping height
                let temp = arrayToSort[j];
                arrayToSort[j] = arrayToSort[j + 1];
                barras[j].style.height = arrayToSort[j]+"px";
                arrayToSort[j+1] = temp;
                barras[j+1].style.height = arrayToSort[j+1]+"px";

                tempBar.style.height = arrayToSort[j]+"px";
                nextValue.style.height = arrayToSort[j+1]+"px";
            };
            await sleep(delay*0.85);
            
            // The bigger value will end on green
            barras[j+1].style.backgroundColor = "var(--green)";
            // 
            barras[j].style.backgroundColor = null;

            await sleep(delay/5);
        }
    }
    barras[0].style.backgroundColor = "var(--green)";
    setTimeout(()=>{solving = false;}, delay*20)
}


async function insertionSort(){
    const barras = document.getElementsByClassName('bar');

    // "var(--green)" = "#65cb50eb"; // INDEX SELECCIONADO;
    // "var(--red)"= "#cb5f50eb"; // INDEX SELECCIONADO;
    // "var(--yellow)" = // COMPARE

    for (let i = 1; i < arrayToSort.length; i++) {
        let j = i - 1;
        let temp = arrayToSort[i];
        await sleep(delay/6);
        tempBar.style.height = temp+'px';

        // Verde es el valor que se está ordenando
        barras[i].style.backgroundColor = "var(--red)";
        await sleep(delay/6);
        barras[i].style.backgroundColor = "var(--green)";

        await sleep(delay);

        while (j >= 0 && arrayToSort[j] > temp) {
            // Amarillo son los elementos que se recorren y comparan comparando
            barras[j].style.backgroundColor = "var(--yellow)";
            nextValue.style.height = arrayToSort[j]+'px';

            arrayToSort[j + 1] = arrayToSort[j];
            barras[j+1].style.height = arrayToSort[j]+"px";
            await sleep(delay);
            barras[j].style.backgroundColor = null;
            j--;
        }
        nextValue.style.height = arrayToSort[j]+'px';


        // Rojo es el indice de i
        barras[j+1].style.backgroundColor = "var(--red)";
        arrayToSort[j+1] = temp;
        
        await sleep(delay/6);
        // Verde es el elemento en que se detiene
        barras[j+1].style.backgroundColor = "var(--green)";
        barras[j+1].style.height = arrayToSort[j+1]+"px";
        
        await sleep(delay/6);
    }


    // Pinta de verde al final
    colorPaint("var(--green)");
    async function colorPaint(color){
        for (let i= 0; i < arrayToSort.length; i++){
            barras[i].style.backgroundColor = color;
            await sleep(delay/6);
        }
    };
    setTimeout(()=>{solving = false;}, delay*20);
}