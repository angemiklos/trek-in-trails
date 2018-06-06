var slideshowIndex = 0;
const LOGIN_URL = "/api/auth/login"
const NEW_USER_URL = "/api/users"

function displayHomePage(res) {
    console.log("HOME PAGE");
    console.log(res);
    // console.log("User Found: " + res.body.nickname);
    // console.log("User Found: " + res.body.username);
    // console.log("User Found: " + res.body.email);
    // console.log("User Found: " + res.body.prefCity);
    // console.log("User Found: " + res.body.prefState);

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
            alert('Success!');
            localStorage.setItem("authToken", data.authToken)
            displayHomePage(data);
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            alert('text status '+textStatus+', err '+err);
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

    console.log("signin is: " + 
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
            alert('Success!');
            displayHomePage(data);
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            alert('text status '+textStatus+', err '+err);
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