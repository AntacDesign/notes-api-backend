const {palindrome}=require('../utils/for_testing')

test('palindrome of Antac69',()=>{
    const result = palindrome('antac')

    expect(result).toBe('catna')
})

test('palindrome of empty string',()=>{
    const result = palindrome('')

    expect(result).toBe('')
})

test('palindrome of undefined',()=>{
    const result = palindrome()

    expect(result).toBeUndefined()
})