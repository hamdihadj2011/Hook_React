import React, { useState,useEffect } from "react";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import uuid from "uuid/v4";
import "./App.css";



const initialExpensse=localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')):[]

function App() {
  //****************** State Value ****************
  const [expenses, setExpenses] = useState(initialExpensse);

  //single expense
  const [charge, setCharge] = useState("");

  //single Amount
  const [amount, setAmount] = useState("");
  //alert
  const [alert, setAlert] = useState({ show: false });
  //edit
  const [edit, setEdit] = useState(false);
  //edit item
  const [id, setID] = useState(0);
  //****************** functionality  ****************
  useEffect(()=>{
    localStorage.setItem('expenses',JSON.stringify(expenses))
  },[expenses])

  const handleCharge = e => {
    setCharge(e.target.value);
  };

  const handleAmount = e => {
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses=expenses.map(item=>{
          return item.id===id ? {...item,charge,amount}:item 
        })
        setExpenses(tempExpenses)
        setEdit(false);
        handleAlert({ type: "success", text: "item edited" });
      } else {
        const singleExpens = {
          id: uuid(),
          charge,
          amount
        };
        setExpenses([...expenses, singleExpens]);
        handleAlert({ type: "success", text: "item added" });
      }

      setCharge("");
      setAmount("");

      console.log(expenses);
    } else {
      //handleAlert

      handleAlert({
        type: "danger",
        text: "charge or amount must not be empty"
      });
    }
  };

  //Clear All items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({
      type: "success",
      text: "All items deleted"
    });
  };
  //delete a single item
  const handleDelete = id => {
    let temExpenses = expenses.filter(expens => expens.id !== id);
    setExpenses(temExpenses);
    handleAlert({
      type: "danger",
      text: "item deleted"
    });
  };

  const handleEdit = id => {
    let expens = expenses.find(item => item.id === id);
    let { charge, amount } = expens;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setID(id);
  };

  
  return (
    <React.Fragment>
      {alert.show && <Alert type={alert.type} text={alert.text} />}

      <h1>Budge Calculator</h1>

      <main className='App'>
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleSubmit={handleSubmit}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        toatal Spanding{" "}
        <span className='total'>
          $
          {expenses.reduce((acc, curr) => {
            return (acc = acc + parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </React.Fragment>
  );
}

export default App;
