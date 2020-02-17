var inquirer = require('inquirer')
var axios = require('axios')
var HtmlTool = require('./generateHTML')
var util = require("util")
var fs = require("fs")
    // const HTML5ToPDF = require("./node_modules/puppeteer/lib")
const path = require("path")
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


function writeToFile(fileName, data) {

}

function init() {
    inquirer.prompt(questions)
        .then(answers => {
            console.log(answers)
            let baseHtml = HtmlTool.generateHTML(answers)


            axios
                .get('https://api.github.com/users/' + answers.github_user + "?client_id=" + process.env.CLIENT_ID + "&client_secret=" + process.env.CLIENT_SECRET)
                .then(function(response) {
                    console.log(response);

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


                    const run = async() => {
                        const html5ToPDF = new HTML5ToPDF({
                            inputPath: path.join(__dirname, "..", "index.html"),
                            outputPath: path.join(__dirname, "..", "tmp", "profile.pdf"),
                            // templatePath: path.join(__dirname, "templates", "basic"),
                            // include: [
                            //     path.join(__dirname, "assets", "basic.css"),
                            //     path.join(__dirname, "assets", "custom-margin.css"),
                            // ],
                        })

                        await html5ToPDF.start()
                        await html5ToPDF.build()
                        await html5ToPDF.close()
                        console.log("DONE")
                        process.exit(0)
                    }


                    // Use the function in an existing promise chain
                    Promise.resolve('something')
                        .then(result => {
                            return doSomething(result)
                        })
                        .then(result => {
                            // Because async functions are promises under the hood we can treat the run function as a promise
                            return run()
                        })
                        .catch(handleErrors)

                    // Usage in try/catch block
                    try {
                        run()
                    } catch (error) {
                        console.error(error)
                    }


                })
                .catch(function(error) {
                    console.log("you got an error: " + error);
                })
                .finally(function() {
                    // always executed
                });
        })
}

init();