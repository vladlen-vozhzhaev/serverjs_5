function getChange(num){
    let coin = num>=10?10:num>=5?5:num>=2?2:num>=1?1:0;
    if (coin !== 0){
        console.log(coin);
        getChange(num-coin);
    }
}

getChange(37)