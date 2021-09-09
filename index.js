//Accessing DOM Elements
const currentBalance = document.getElementById("currentBalance");
const outstandingLoan = document.getElementById("outstandingLoan");
const workpay = document.getElementById("pay");
const selectLaptop = document.getElementById("laptop");
const laptopFeatures = document.getElementById("laptopFeatures");
const laptopImg = document.getElementById("laptopImg");
const laptopPrice = document.getElementById("laptopPrice");
const laptopDescription = document.getElementById("buyLaptopDescription");
const laptopName = document.getElementById("laptopName");
//Variables
let balance = 0;
let workbalance = 0;
let loanAmount = 0;
let loanbutton = document.getElementById("payLoanButton").style.display = "none"
let purchasedPc = true;
//URL for accessing API
const baseURL = "https://noroff-komputer-store-api.herokuapp.com";


//Onclick function for the workButton, increases workpay by 100 each click
function workFunction(){
    workbalance += 100
    updateWorkPay()
}

//Arrow functions for updating the values of DOM Elements
const updateBalance = () => {
    currentBalance.innerText ="Balance:" + balance + "kr";
  };
  
const updateWorkPay = () =>{
    workpay.innerText = "Pay:" + workbalance + "kr";
}; 

const updateOutstandingLoan = () =>{
    outstandingLoan.innerText= "Outstanding Loan:" + loanAmount + "kr"
}


//Onclick function for the bankButton, transfers workpay to currentbalance 
//different handling if the user has an oustanding loan
function bankFunction(){

    if(workbalance == 0){
        alert("No funds, get to work")
    }
    if(loanAmount == 0){
        loanAmount - workbalance       
        balance += workbalance
        workbalance -= workbalance
    }
    if (loanAmount > 0){
        if(workbalance*0.10 > loanAmount){
            workbalance -= loanAmount
            loanAmount -= loanAmount
            balance += workbalance
            workbalance -= workbalance
        }
        else{
            loanAmount -= workbalance*0.10
            balance += workbalance*0.90          
            workbalance -= workbalance
        }
        updateOutstandingLoan()
    }
    updateBalance()
    updateWorkPay()
}
// function for the payLoanButton which takes the full work payment to downpay the loan
function payLoanFunction(){
    
    if(loanAmount == 0){
        alert("You have no loans to downpay, your pay gets directly transferred to you balance")
    }
    if(workbalance == 0){
        alert("You have no funds")
    }
    if( loanAmount>= workbalance){
        loanAmount -= workbalance
        workbalance-=workbalance
    }
    //transfers the remaining workbalance to balance if its higher than the remaining loan
    if( loanAmount< workbalance){
        alert("Your loan is now fully downpaid, since your income was higher than the remaining loan amount, the rest is transferred to your account balance.")
        workbalance -= loanAmount
        loanAmount -= loanAmount
        balance += workbalance

        workbalance -= workbalance
    }
    updateBalance()
    updateWorkPay()
    updateOutstandingLoan()
}


// Function for the button GetLoanButton in the Banking Class
function getLoanFunction(){
    if(balance == 0){
        alert("Your Balance is to low to get a loan")
    }
    if(balance > 0){
        if(loanAmount > 0){
            alert("You must pay back the oustanding loan value before you can get a new loan")
        }

        if(purchasedPc === false){
          alert("You must buy a PC if you want to get another loan")
        }
        
        else{
            var input = prompt("How much do you want to borrow")
        }        
    }
    if(input > (balance*2)){
        alert("You cant get a loan higher than:" + " " + (balance*2) )
    }
    if(input <=0){
        alert("You must enter an amount larger than 0")
    }

    if(input <= (balance*2) && input > 0 && purchasedPc === true){
        loanAmount += parseInt(input)
        alert("Request Accepted! You now owe me" + " " + (loanAmount) + "kr")
        loanbutton = document.getElementById("payLoanButton").style.display = "block"
        parseInt(loanAmount)
        balance = balance + loanAmount
        purchasedPc = false;
        updateBalance()
        updateOutstandingLoan()
    }
}

function buyNowButton(){
    price = filteredList[0].price;
    if (balance >= price){
        balance -= price
        updateBalance()
        purchasedPc = true;
        alert("You have bought:" + filteredList[0].title);
    }
    else{
        alert("I'm sorry, you cant afford:" + filteredList[0].title);
    }
}

const populatePcs = async () => {
    try {
      const fetchPcs = await fetch(baseURL + "/computers");
      listOfPcs = await fetchPcs.json();
      console.log(listOfPcs);
      listOfPcs.map((element) => {
        const optionElement = document.createElement("option");
        optionElement.innerText = element.title;
        selectLaptop.appendChild(optionElement);
      });
      getFeatures(selectLaptop.firstElementChild.innerText);
    } catch (error) {
      console.error(error);
    }
  };

const getFeatures = (option) => {
    if (typeof option == "string") {
      filteredList = listOfPcs.filter((chosen) => chosen.title == option);
    } else {
      filteredList = listOfPcs.filter(
        (chosen) => chosen.title == option.target.value
      );
    }
    laptopFeatures.innerHTML = "";
    filteredList.map(async (element) => {
      // Adding features
      element.specs.forEach((feature) => {
        const listElement = document.createElement("li");
        listElement.innerText = feature;
        laptopFeatures.appendChild(listElement);
      });
  
      // Adding image
      try {
        const image = await fetch(baseURL + "/" + element.image);
        if (!image.ok) {
          laptopImg.src = "assets/placeholder.jpg";
        } else {
          laptopImg.src = baseURL + "/" + element.image;
        }
      } catch (error) {
        console.log(error);
      }
  
      // Adding title
      laptopName.innerText = element.title;
  
      // Adding description
      laptopDescription.innerText = element.description;
  
      // Adding price
      laptopPrice.innerText = element.price + "kr";
    });
  };
populatePcs();
selectLaptop.addEventListener("change",getFeatures);


 






