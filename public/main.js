var slideshowIndex = 0;
const LOGIN_URL = "localhost:8080/api/auth/login"
const NEW_USER_URL = "localhost:8080/api/users"

function displayHomePage(res) {
    console.log("HOME PAGE");
    console.log("User Found: " + res.body.nickname);
    console.log("User Found: " + res.body.username);
    console.log("User Found: " + res.body.email);
    console.log("User Found: " + res.body.prefCity);
    console.log("User Found: " + res.body.prefState);

}

function displayError(err) {
    console.log("ERROR!  ERROR! " + err);
}

function verifySignin() {
    event.preventDefault();
    event.stopPropagation();

    
    let signin = {
            "username"    : $("[type='email']").val(),
            "password" : $("[type='password']").val()
    };

    console.log("signin is: " + signin.email + " " + signin.password);

    $.ajax({
        type: "POST",
        url: LOGIN_URL,
        data: signin,
        success: function(data) {
            //show content
            alert('Success!');
            displayHomePage(res);
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
        "username" : $("[type='email']").val(),
        "password" : $("[type='password']").val(),
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

    $.ajax({
        type: "POST",
        url: NEW_USER_URL,
        data: signup,
        success: function(data) {
            //show content
            alert('Success!');
            displayHomePage(res);
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
    $("#js-signin-page").prop("hidden",true);
    $("#js-signup-page").prop("hidden",false);
}

function displaySignup(){

    event.preventDefault();
    event.stopPropagation();

    $("#js-signin").prop("hidden",true);
    $("#js-signup").prop("hidden",false);
    
    // when the sign up button is pressed, verify the info
    $("#js-signup").on("submit", verifySignup);

    $("#js-signin-page").prop("hidden",false);
    $("#js-signup-page").prop("hidden",true);

    $("#js-signin-page").on("click", displaySignin);
}

function slideshow() {

    var imgs = $(".bkg-images").get();

    for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.display = "none";  
    }

    slideshowIndex++;
    if (slideshowIndex > imgs.length) {
        slideshowIndex = 1;
    }    

    imgs[slideshowIndex-1].style.display = "block";  
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