var slideshowIndex = 0;
const LOGIN_URL = "/api/auth/login";
const NEW_USER_URL = "/api/users";
const HOME_URL = "/api/hikes/";
const USER_URL = "/api/users/";

function getHomeData(url, user) {

    console.log("here's the url: " + url + user);
    console.log("data is set to: " + JSON.stringify(user));
    let token = localStorage.getItem("authToken");
    console.log("check: " + token);
    return $.ajax({
      url: url + user,
      type: 'get',
      dataType: 'json',
      data: JSON.stringify({username : user}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("authToken")
      },
    })
    .always(function(res) {
      // display an empty home page?
      console.log("this is res: " + JSON.stringify(res));
    })
    .fail(function(jqXHR, textStatus, err) {
      // handle request failures
      console.log('text status '+textStatus+', err '+err);
      displayError(err);
    });
  
}
    
  function displayHomePage(res, isNewUser) {
    let user = localStorage.getItem('user');
    console.log("HOME PAGE");
    console.log(res);
    console.log(isNewUser);

    // load the empty home page
    $("#js-landing").prop('hidden',true);
    $("#js-home").prop('hidden',false).load("home.html");

    // display for a new user - no data to get
    if (isNewUser) {
        //let newUser = $.parseJSON(localStorage.getItem("user"));
        let homeHtml = `
        <h2>Hi, ${res.nickname}</h2>
        `;
        $("#js-greetings").html(homeHtml);
    
    // display for an established user - get data
    } else {
        getHomeData(HOME_URL, res).done(function(data) {
            console.log('Success! Home page should be displayed.');
            console.log('data is: ' + JSON.stringify(data));
        });
          
        getHomeData(USER_URL, res).done(function(data) {
            console.log('Success! User data should be displayed.');
            console.log('data is: ' + JSON.stringify(data));
            localStorage.setItem("user", JSON.stringify(data));
        });
    }
}

function displayError(err) {
    console.log("The error you are getting is: " + err);
    var errHtml = "Sorry - unknown issue.  Try again.";
    if (localStorage.getItem("errorDisplayed") == "false") {
        if (err === "Unauthorized") {
            errHtml = `<div class="js-error"><p class="js-err-msg">Username or password is incorrect</p></div>`;
        }
        $("#js-fs-signin").after(errHtml);
        localStorage.setItem("errorDisplayed", true);
    }
}

function clearErrors(){
    $(".js-error").remove();
    localStorage.setItem("errorDisplayed", false);
}

function verifySignin() {
    event.preventDefault();
    event.stopPropagation();
 
    let signin = {
            "username" : $("[type='email']").val(),
            "password" : $("[type='password']").val()
    };

    console.log("signin is: " + signin.username + " " + signin.password);

    $.ajax({
        type: "POST",
        url: LOGIN_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(signin),
        success: function(data) {
            //show content
            console.log('Success! for: ' + signin.username);
            localStorage.setItem("authToken", data.authToken)
            displayHomePage(signin.username, false);
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            console.log('text status '+textStatus+', err '+err);
            displayError(err);
        }
    });
}

function verifySignup() {
    event.preventDefault();
    event.stopPropagation();

    let signup = {
        "nickname" : $("#js-nickname").val(),
        "username" : $("#js-username").val(),
        "password" : $("#js-password").val(),
        "prefCity" : $("#js-city").val(),
        "prefState" : $("#js-state").val()
    };

    console.log("signup is: " + 
                    signup.nickname + " " + 
                    signup.username + " " + 
                    signup.password + " " + 
                    signup.prefCity + " " + 
                    signup.prefState 
                );
    console.log(signup);

    $.ajax({
        type: "POST",
        url: NEW_USER_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(signup),
        success: function(data) {
            //show content
            console.log('Success!');
            localStorage.setItem("user", data);
            displayHomePage(data, true);
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            console.log('text status '+textStatus+', err '+err);
            displayError(err);
        }
    });
}
 
function displaySignin(){
    event.preventDefault();
    event.stopPropagation();

    $("#js-signin").prop("hidden",false);
    $("#js-signup").prop("hidden",true);
}

function displaySignup(){

    event.preventDefault();
    event.stopPropagation();

    $("#js-signin").prop("hidden",true);
    $("#js-signup").prop("hidden",false);
    
    // when the sign up button is pressed, verify the info
    $("#js-signup").on("submit", verifySignup);

    $("#js-signin-page").on("click", displaySignin);
}

function slideshow() {

    var fadedImgs = $(".bkg-images").get();
    var vividImgs = $(".fg-images").get();

    for (var i = 0; i < fadedImgs.length; i++) {
        fadedImgs[i].style.display = "none";  
        vividImgs[i].style.display = "none";  
    }

    slideshowIndex++;
    if (slideshowIndex > fadedImgs.length) {
        slideshowIndex = 1;
    }    

    fadedImgs[slideshowIndex-1].style.display = "block";  
    vividImgs[slideshowIndex-1].style.display = "block";  
    setTimeout(slideshow, 5000); // Change image every 5 seconds
}

function main() {
 
    slideshow();

    // when the sign in button is pressed, verify the user exists
    $("#js-signin").on("submit", verifySignin);

    // when the sign up page is requested, display it
    $("#js-signup-page").on("click", displaySignup);

    // on keypress, clear all errors
    $("[type='password']").on("keypress", clearErrors);
    $("[type='email']").on("keypress", clearErrors);
}

$(main);