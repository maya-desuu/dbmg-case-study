
function testFunction() {
  var x = 10
  let y = 20;
  const z = 30
  if (x == 10) {
    console.log("x is 10")
  }

  for (var i = 0; i < 10; i++) {
    console.log(i)
  }

  function innerFunction() {
    console.log("Inner function")
  }

  y = 'a string";
  z = 50; // This should cause an error because z is a constant
}

testFunction();

