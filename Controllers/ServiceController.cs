using Microsoft.AspNetCore.Mvc;
using JNKVAA;

namespace JNKVAA.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private WebService _webService;

        public ServiceController(IConfiguration configuration)
        {
            _configuration = configuration;
            _webService = new WebService();
        }

        [HttpGet("helloworld")]
        public IActionResult HelloWorld()
        {
            return Ok(new { message = _webService.HelloWorld() });
        }

        [HttpPost("user-registration")]
        public IActionResult Register([FromBody] UserRegistrationRequest request)
        {
            var result = _webService.newUserRegistrationWeb(
                request.Name, request.Sname, request.Gender, request.Batchno,
                request.Dob, request.Bgroup, request.Mobile, request.Email,
                request.Pwd, request.City, request.Profession, request.CountryCode, request.House
            );
            return Ok(result);
        }

        [HttpPost("user-login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var result = _webService.authenticateUser(request.Phone, request.Password, "", "", "");
            return Ok(result);
        }

        [HttpPost("admin-login")]
        public IActionResult AdminLogin([FromBody] LoginRequest request)
        {
            var result = _webService.authenticateAdmin(request.Phone, request.Password);
            return Ok(result);
        }

        [HttpPost("forgot-otp")]
        public IActionResult ForgotOtp([FromBody] ForgotOtpRequest request)
        {
            var result = _webService.sendForgotOtp(request.Email);
            return Ok(result);
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var result = _webService.verifyOtpAndResetPwd(request.Email, request.Otp, request.NewPassword);
            return Ok(result);
        }

        [HttpGet("users/{uid}")]
        public IActionResult GetUserInfo(string uid)
        {
            var result = _webService.getuserInfo(uid);
            return Ok(result);
        }

        [HttpPut("users/{uid}")]
        public IActionResult UpdateUserData(string uid, [FromBody] UpdateUserDataRequest request)
        {
            var result = _webService.updateUserData(uid, request.Fname, request.Sname, request.Gender,
                request.Dob, request.MaritalStatus, request.Bgroup, request.Phno, request.Email,
                request.City, request.Profession, request.Designation, request.WorkingIn,
                request.Lclass, request.WorkingAs, request.Bio, request.AdminNotes,
                request.InstaUrl, request.FbookUrl, request.MedicalInsurProvi,
                request.MedicalInsurExpire, request.ExpertIn, request.LinkdnUrl,
                request.BatchNo, request.Native, request.UserUpdated, request.CountryCode
            );
            return Ok(result);
        }
    }

    public class UserRegistrationRequest
    {
        public string Name { get; set; }
        public string Sname { get; set; }
        public string Gender { get; set; }
        public string Batchno { get; set; }
        public string Dob { get; set; }
        public string Bgroup { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Pwd { get; set; }
        public string City { get; set; }
        public string Profession { get; set; }
        public string CountryCode { get; set; }
        public string House { get; set; }
    }

    public class LoginRequest
    {
        public string Phone { get; set; }
        public string Password { get; set; }
    }

    public class ForgotOtpRequest
    {
        public string Email { get; set; }
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }

    public class UpdateUserDataRequest
    {
        public string Fname { get; set; }
        public string Sname { get; set; }
        public string Gender { get; set; }
        public string Dob { get; set; }
        public string MaritalStatus { get; set; }
        public string Bgroup { get; set; }
        public string Phno { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Profession { get; set; }
        public string Designation { get; set; }
        public string WorkingIn { get; set; }
        public string Lclass { get; set; }
        public string WorkingAs { get; set; }
        public string Bio { get; set; }
        public string AdminNotes { get; set; }
        public string InstaUrl { get; set; }
        public string FbookUrl { get; set; }
        public string MedicalInsurProvi { get; set; }
        public string MedicalInsurExpire { get; set; }
        public string ExpertIn { get; set; }
        public string LinkdnUrl { get; set; }
        public string BatchNo { get; set; }
        public string Native { get; set; }
        public string UserUpdated { get; set; }
        public string CountryCode { get; set; }
    }
}
