var slideshowIndex = 0;
const LOGIN_URL = "/api/auth/login";
const NEW_USER_URL = "/api/users";
const HOME_URL = "/home";
const HIKES_URL = "/api/hikes";
const USER_URL = "/myAccount"

function displayHomePage(res, isNewUser) {
    console.log("HOME PAGE");
    console.log(res);

    // retrieve html for home page
    $.ajax({
        type : "GET",
        url  : HOME_URL,
        success: function(data) {
            //show content
            console.log('Success! Home page should be displayed.');

            // display for a new user - no data to get
            if (isNewUser) {
                //let newUser = $.parseJSON(localStorage.getItem("user"));
                let homeHtml = `
                <p>Hi, ${res.nickname}</p>
                `;
                $("#js-home").html(homeHtml);
            
            // display for an established user - get data
            } else {
                $.when(
                    $.get(USER_URL),
                    $.get(HIKES_URL),
                )
                $.done(function(user, html){
                    //all is well. display the user personal data and hikes
                    console.log('Success!');
                    localStorage.setItem("user", user);
                   // location.assign(html);
                })
                $.fail(function(jqXHR, textStatus, err){
                    //show error message
                    console.log('text status '+textStatus+', err '+err);
                    displayError(err);
                    
                });

            }
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            console.log('text status '+textStatus+', err '+err);
            displayError(err);
        }        
    });
}

function displayError(err) {
    console.log("ERROR!  ERROR! " + err);
}

function verifySignin() {
    event.preventDefault();
    event.stopPropagation();

    
    let signin = {
            "username" : $("[type='email']").val(),
            "password" : $("[type='password']").val()
    };

    console.log("signin is: " + signin.email + " " + signin.password);

    $.ajax({
        type: "POST",
        url: LOGIN_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(signin),
        success: function(data) {
            //show content
            console.log('Success!');
            localStorage.setItem("authToken", data.authToken)
            displayHomePage(signin.email, false);
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
}

$(main);