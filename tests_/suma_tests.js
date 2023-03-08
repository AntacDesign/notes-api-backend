const suma=(a,b)=>{
    return a - b
}

const tests = [
    {a:1,b:2,result:3},
    {a:0,b:0,result:0},
    {a:5,b:1,result:6}
]

tests.forEach(test =>{
    const {a,b,result} = test
    console.assert(
        suma(a,b) == result,
        `Suma of ${a} and ${b} expected to be ${result} `
    )
})

console.log(` ${tests.length} test  perfomed...`)