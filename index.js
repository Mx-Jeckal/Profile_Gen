var inquirer = require('inquirer')
var axios = require('axios')
var HtmlTool = require('./generateHTML')
var fs = require("fs")
var pdf = require('html-pdf');
require("dotenv").config()

const questions = [{
        type: 'input',
        name: 'github_user',
        message: "What's your Github user-name?"
    },
    {
        type: 'list',
        name: 'color',
        message: 'What is your favorite color?',
        choices: ["red", "blue", "pink", "green"],
        filter: function(val) {
            return val.toLowerCase();
        }
    }
];

function init() {
    inquirer.prompt(questions)
        .then(answers => {
            let baseHtml = HtmlTool.generateHTML(answers)


            axios
                .get('https://api.github.com/users/' + answers.github_user + "?client_id=" + process.env.CLIENT_ID + "&client_secret=" + process.env.CLIENT_SECRET)
                .then(function(response) {

                    let addHTML = ` 
            <div class="wrapper">
                <div class="row">
                    <div class="photo-header">
                            <img src="${response.data.avatar_url}">
                            <h1>Hi!</h1>
                            <h2>My name is ${response.data.name}!</h2>
                        <div class="links-nav">
                        <div class="nav-link"><a href="${response.data.location}"><i class="fas fa-location-arrow"></i>${response.data.location}</a></div>
                        <div class="nav-link"><a href="${response.data.html_url}"><i class="fab fa-github-alt"></i>GitHub</a></div>
                        <div class="nav-link"><a href="${response.data.blog}"><i class="fas fa-blog"></i>Blog</a></div>
                        </div>
                    </div>
                </div>
                <main>
                    <h5 class="links-nav">${response.data.bio}</h5>
                    <div class="row">
                    <div class="col">
                        <div class="card"><h4>Public Repositories</h4> <br> ${response.data.public_repos}</div>
                        <div class="card"><h4>GitHub Stars</h4> <br> ${response.data.public_gists}</div>
                    </div>
                    <div class="col">
                        <div class="card"><h4>Followers</h4><br>${response.data.followers}</div>
                        <div class="card"><h4>Following</h4><br>${response.data.following}</div>
                    </div>
                    </div>
                </main>
            </div>
    </body>
    </html>`
                    baseHtml += addHTML
                        // console.log(baseHtml)
                    fs.writeFileSync("index.html", baseHtml)
                        // loop thru your data
                        // and append the wright html strings to the baseHtml
                        // make sure you comple the html propertly 
                        // write the content of baseHtml to myFile.html
                        // convert the html file into pdf

                    var html = fs.readFileSync('./index.html', 'utf8');
                    var options = { format: 'Letter' };

                    pdf.create(html, options).toFile('./profile.pdf', function(err, res) {
                        if (err) return console.log(err);
                        console.log(res); // { filename: '/app/businesscard.pdf' }
                    })


                    .catch(function(error) {
                        console.log("you got an error: " + error);
                    })

                })
        })
}

init()