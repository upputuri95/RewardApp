export function calculateResults(incomingData) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pointsPerTransaction = incomingData.map(transaction=> {
      let points = 0;
      let over100 = transaction.amount - 100;
      let over50 = transaction.amount - 50;
      if (over100 > 0) {
        points += (over100 * 2);
      }
      if ( transaction.amount > 50 && transaction.amount  > 100 ) {
        points += 50;      
      }
      if(transaction.amount  > 50 &&  transaction.amount  < 100){
        points += (over50*1)
      }
      const month = new Date(transaction.transactionDate).getMonth();
      return {...transaction, points, month};
    });
                 
    let byCustomer = {};
    let totalPointsByCustomer = {};
    pointsPerTransaction.forEach(pointsPerTransaction => {
      let {customerID, transactionName, month, points} = pointsPerTransaction;   
      if (!byCustomer[customerID]) {
        byCustomer[customerID] = [];      
      }    
      if (!totalPointsByCustomer[customerID]) {
        totalPointsByCustomer[transactionName] = 0;
      }
      totalPointsByCustomer[transactionName] += points;
      if (byCustomer[customerID][month]) {
        byCustomer[customerID][month].points += points;
        byCustomer[customerID][month].monthNumber = month + 1;
        byCustomer[customerID][month].numTransactions++;      
      }
      else {
        byCustomer[customerID][month] = {
          customerID,
          transactionName,
          monthNumber:month,
          month: months[month],
          numTransactions: 1,        
          points
        }
      }    
    });
    let tot = [];
    for (var custKey in byCustomer) {    
      byCustomer[custKey].forEach(cRow=> {
        tot.push(cRow);
      });    
    }
    let totByCustomer = [];
    for (custKey in totalPointsByCustomer) {    
      totByCustomer.push({
        transactionName: custKey,
        points: totalPointsByCustomer[custKey]
      });    
    }
    return {
      // summaryByCustomer: tot,
      pointsPerTransaction,
      // totalPointsByCustomer:totByCustomer
    };
  }