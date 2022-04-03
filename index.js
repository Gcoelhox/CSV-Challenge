const fs = require("fs");
const fastCsv = require("fast-csv");

const options = {
  objectMode: true,
  delimiter: ",",
  headers: false,
};
function find(needle, haystack) {
    var results = [];
    var idx = haystack.indexOf(needle);
    while (idx != -1) {
        results.push(idx);
        idx = haystack.indexOf(needle, idx + 1);
    }
    return results;
}
const data = [];

let json = {"fullname": "", "eid": "", "groups": [], "addresses": [], "invisible": "", "see_all": ""};
let addresses = {"type": "", "tags": [], "address": ""}
let obj = [];
var counter = 0;
//create output.json file
fs.createReadStream('input.csv')
.pipe(fastCsv.parse(options))
.on("error", error => {
  console.log(error)
})
.on("data", row => {
  data.push(row)
  counter++
})
.on("end", () => {
  //Gerar o tamanho de objetos no array
    for (x=1; x < counter; x++) {
        obj.push(json)
    }
    //Gerar array de addresses
    for (x=0; x < data[0].length; x++) {
      var phone = data[0][x].includes('phone')
      var email = data[0][x].includes('email')
      
      if (phone === true || email === true ) {
        json.addresses.push(addresses)
      }
    }
    //Gerar o arquivo de output
    fs.writeFile('output.json',JSON.stringify(obj, null,2), err => {
      if (err) {
        console.log(err)
      }
    });
});


fs.createReadStream('input.csv')
.pipe(fastCsv.parse(options))
.on("error", error => {
  console.log(error)
})
.on("data", row => {})
.on("end", () => {
  //Tratamento do campo groups
  const file = require('./output.json')
  const group = find('group',data[0])
  for (x=0; x < counter-1; x++) {
    if (group.length > 1) {
      for (i=0; i < group.length; i++) {
        var manageData = data[x+1][group[i]].split('/')
        var normalizedData = manageData[0].replace(/['"]+/g, '')
        if (x < counter) {
          file[x].groups.push(normalizedData)
        }
      }
    }
  }
  
  //Inclusão dos valores de type
  var address = [];
  for (x=0; x < data[0].length; x++) {
    var phone = data[0][x].includes('phone')
    var email = data[0][x].includes('email')

    if (phone === true) {
      address.push('phone')
    }
    if (email === true) {
      address.push('email')
    }
  }
  for (i=0; i < counter-1; i++) {
    for (z=0; z < address.length; z++) {
      file[i].addresses[z].type = `${address[z]}`
    }
  }
  //Inclusão das tags
  var tagsIndex = [];
  for (x=0; x < data[0].length; x++) {
    var student = data[0][x].includes('Student')
    var parent = data[0][x].includes('Parent')
    var pedagogical = data[0][x].includes('Pedagogical')
    var financial = data[0][x].includes('Financial')
    
    if (student === true && data[0][x].includes('phone')) {
      student = data[0][x].replace('phone ',' ').replace(/['"]+/g, '')
      student = student.split(' ')
      student = student.splice(1)
      tagsIndex.push(student)
    } else if (student === true && data[0][x].includes('email')){
      student = data[0][x].replace('email ',' ').replace(/['"]+/g, '')
      student = student.split(' ')
      student = student.splice(1)
      tagsIndex.push(student)
    } else if (parent === true && data[0][x].includes('phone')) {
      parent = data[0][x].replace('phone ',' ').replace(/['"]+/g, '')
      parent = parent.split(' ')
      parent = parent.splice(1)
      tagsIndex.push(parent)
    } else if (parent === true && data[0][x].includes('email')){
      parent = data[0][x].replace('email ',' ').replace(/['"]+/g, '')
      parent = parent.split(' ')
      parent = parent.splice(1)
      tagsIndex.push(parent)
    } else if (pedagogical === true && data[0][x].includes('phone')) {
      pedagogical = data[0][x].replace('phone ',' ').replace(/['"]+/g, '')
      pedagogical = pedagogical.split(' ')
      pedagogical = pedagogical.splice(1)
      tagsIndex.push(pedagogical)
    } else if (pedagogical === true && data[0][x].includes('email')){
      pedagogical = data[0][x].replace('email ',' ').replace(/['"]+/g, '')
      pedagogical = pedagogical.split(' ')
      pedagogical = pedagogical.splice(1)
      tagsIndex.push(pedagogical)
    } else if (financial === true && data[0][x].includes('phone')) {
      financial = data[0][x].replace('phone ',' ').replace(/['"]+/g, '')
      financial = financial.split(' ')
      financial = financial.splice(1)
      tagsIndex.push(financial)
    } else if (financial === true && data[0][x].includes('email')){
      financial = data[0][x].replace('email ',' ').replace(/['"]+/g, '')
      financial = financial.split(' ')
      financial = financial.splice(1)
      tagsIndex.push(financial)
    }   
  }
  for (i=0; i < counter-1; i++) {
    for (z=0; z < tagsIndex.length; z++) {
      file[i].addresses[z].tags.push(`${tagsIndex[z]}`)
    }
  } 
   
  //Inclusão do campo fullname
  const nameIndex = find('fullname',data[0])
  for (x=0; x < counter-1; x++) {
    file[x].fullname = data[x+1][nameIndex[0]]
  }

  //Inclusão do campo eid
  const eidIndex = find('eid',data[0])
  for (x=0; x < counter-1; x++) {
    file[x].eid = data[x+1][eidIndex[0]]
  }

  //Inclusão do campo invisible
  const invisibleIndex = find('invisible',data[0])
  for (x=0; x < counter-1; x++) {
    if (data[x+1][invisibleIndex[0]] === 'yes' || data[x+1][invisibleIndex[0]] == 1 ) {
    file[x].invisible = true
    } else { file[x].invisible = false}
  }

  //Inclusão do campo see_all
  const seeAllIndex = find('see_all',data[0])
  for (x=0; x < counter-1; x++) {
    if (data[x+1][seeAllIndex[0]] === 'yes' || data[x+1][seeAllIndex[0]] == 1 ) {
    file[x].see_all = true
    } else { file[x].see_all = false}
  }

  //Inclusão do campo address
  const contact = [];
  const emailIndex = [];
  for (x=0; x < data[0].length; x++) {
    if (data[0][x].includes('email')) {
      contact.push(find(data[0][x], data[0]))
    } else if (data[0][x].includes('phone')) {
      contact.push(find(data[0][x], data[0]))
    }
  }

  for (i=0; i < counter-1;i++) {
    for (y=0; y < contact.length; y++) {
      file[i].addresses[y].address = data[i+1][contact[y]]
    }
  }
  
  fs.writeFile('output.json', JSON.stringify(file, null, 2), err => {
    if (err) {
      console.log(err)
    }
  });
});

