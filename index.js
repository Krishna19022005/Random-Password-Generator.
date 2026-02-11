const inputSlider = document.querySelector(".slider");
const displayLen = document.querySelector("[pass-length-num]")
const passDisplay = document.querySelector(".display");
const coppyBtn = document.querySelector(".copy");
const copyMsg = document.querySelector("[copyMsg]");
const upper = document.querySelector("#uppercase");
const lower = document.querySelector("#lowercase");
const number = document.querySelector("#numbers");
const symbol = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generate-button")
const strength = document.querySelector("[strendth-indicator]")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

let password="";
let passLength = 7;
let checkCount = 0;
const symbolString ="!@#$%^&*()_+-=[]{}|;:',.<>/?`~";
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passLength;
    displayLen.innerText=passLength;
    const min= inputSlider.min;
    const max= inputSlider.max;

    const percent = ((passLength - min) * 100) / (max - min);

    inputSlider.style.setProperty("--fill", `${percent}%`);
}

function setIndicator(color){
    strength.style.backgroundColor=color;
    strength.style.boxShadow =`0 0 12px ${color}`;
}

function getRndInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function generateRndNumber(){
    return getRndInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInt(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(getRndInt(65,91));
}

function generateSymbol(){
    let rn = getRndInt(0,symbolString.length-1);
    return symbolString.charAt(rn);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;

    if(upper.checked) hasUpper=true;
    if(lower.checked) hasLower=true;
    if(number.checked) hasNum=true;
    if(symbol.checked) hasSymbol=true;

    if(hasUpper && hasLower && hasNum && hasSymbol && passLength>=7){
        setIndicator('rgb(20, 220, 170)');
    }else if(hasLower&&hasUpper && (hasNum || hasSymbol) && passLength>=6) setIndicator('#0f0');
    else if((hasLower||hasUpper) && (hasNum || hasSymbol)) setIndicator('#ff0')
    else setIndicator('#f00');

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText="Copied";
    }catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{
    passLength=e.target.value;
    handleSlider();
})

coppyBtn.addEventListener('click',()=>{
    if(passDisplay.value.length) copyContent(); 
})

function handleCheckbox(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passLength<checkCount){
        passLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckbox);
})

//Fish Yates Method
function shufflePassword(str) {
    let arr = str.split("");

    for (let i = arr.length - 1; i > 0; i--) {
        let j = getRndInt(0, i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join("");
}


generateBtn.addEventListener('click',()=>{
    if(checkCount<=0) return;
    // if(passLength<checkCount){
    //     passLength=checkCount;
    //     handleSlider();
    // }
    //find newPassword
    password="";

    let pass=[];

    if(upper.checked) pass.push(generateUpperCase);
    if(lower.checked) pass.push(generateLowerCase);
    if(number.checked) pass.push(generateRndNumber);
    if(symbol.checked) pass.push(generateSymbol);

    for(let i=0;i<pass.length;i++){
        password+=pass[i]();
    }

    for(let i=0;i<passLength-pass.length;i++){
        let randIndex= getRndInt(0,pass.length-1);
        password+=pass[randIndex]();
    }

    password=shufflePassword(password);
    
    passDisplay.value = password;

    calcStrength();
})