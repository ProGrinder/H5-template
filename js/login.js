

$(function (){

    var signUpButton = document.getElementById('signUp')
    var signInButton = document.getElementById('signIn')
    var container = document.getElementById('dowebok')

    signUpButton.addEventListener('click', function () {
        container.classList.add('right-panel-active')
    })

    signInButton.addEventListener('click', function () {
        container.classList.remove('right-panel-active')
    })

    //获取email
    $("#email").focus(function () {
        $("#alert-box").removeClass("in").addClass("hide");
    })

    $("#email").blur(function (){
        //   设置邮件的正则表达式
        var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        //   获取输入的内容
        var emailVal = $("#email").val();
        console.log(emailVal);
        var flag = emailReg.test(emailVal);
        console.log(flag);
        if (flag == false)
        {
            //显示警告框
            //1.获取警告框
            $("#alert-box").removeClass("hide").addClass("in");

        }

    })
})


