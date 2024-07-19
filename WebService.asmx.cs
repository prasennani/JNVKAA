using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Globalization;
using Newtonsoft.Json;
using System.Text;
using System.Text.RegularExpressions;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Xml.Linq;
using System.Web.Script.Serialization;
using static JNKVAA.WebService;
using System.Net.Sockets;
using System.Security.Cryptography;


namespace JNKVAA
{
    
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class WebService : System.Web.Services.WebService
    {

        private readonly string merchantId = "PGTESTPAYUAT";
        private readonly string apiKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
        private readonly string apiKeyIndex = "1";
        private readonly string hostUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox";

        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader rdr;

        [WebMethod(EnableSession = true)]
        public string InitiatePayment(string name, string mobileNo, string email, string batchNo, string donatePurpose, string donationAmount)
        {
            string transactionId = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 20);
            string donateId = Guid.NewGuid().ToString();

            try
            {
                string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
                using (con = new SqlConnection(constr))
                {
                    con.Open();
                    cmd = new SqlCommand("INSERT INTO TB_DonationAmount (DonateId, Name, MobileNo, Email, BatchNo, PaymentMode, DonationAmount, ReferenceNumber, PaymentScreenshot, paymentStatus, datee, DonationPurpose, timee, TransactionId) OUTPUT inserted.RowId VALUES (@DonateId, @Name, @MobileNo, @Email, @BatchNo, @PaymentMode, @DonationAmount, @ReferenceNumber, @PaymentScreenshot, @paymentStatus, @datee, @DonationPurpose, @timee, @TransactionId)", con);

                    cmd.Parameters.AddWithValue("DonateId", donateId);
                    cmd.Parameters.AddWithValue("Name", name);
                    cmd.Parameters.AddWithValue("MobileNo", mobileNo);
                    cmd.Parameters.AddWithValue("Email", email);
                    cmd.Parameters.AddWithValue("BatchNo", batchNo);
                    cmd.Parameters.AddWithValue("PaymentMode", "PhonePe");
                    cmd.Parameters.AddWithValue("DonationAmount", int.Parse(donationAmount));
                    cmd.Parameters.AddWithValue("ReferenceNumber", DBNull.Value);
                    cmd.Parameters.AddWithValue("PaymentScreenshot", DBNull.Value);
                    cmd.Parameters.AddWithValue("paymentStatus", 0); // Pending
                    cmd.Parameters.AddWithValue("datee", DateTime.Now);
                    cmd.Parameters.AddWithValue("DonationPurpose", donatePurpose);
                    cmd.Parameters.AddWithValue("timee", DateTime.Now.TimeOfDay);
                    cmd.Parameters.AddWithValue("TransactionId", transactionId);

                    int rowId = (int)cmd.ExecuteScalar();

                    if (rowId > 0)
                    {
                        var payload = new
                        {
                            merchantId = merchantId,
                            transactionId = transactionId,
                            merchantUserId = email,
                            amount = int.Parse(donationAmount) * 100, // in paise
                            merchantOrderId = donateId,
                            mobileNumber = mobileNo,
                            message = $"Donation by {name}",
                            email = email,
                            shortName = name,
                            paymentScope = "PHONEPE",
                            deviceContext = new
                            {
                                phonePeVersionCode = 303391
                            }
                        };

                        string payloadJson = JsonConvert.SerializeObject(payload);
                        string base64Payload = Convert.ToBase64String(Encoding.UTF8.GetBytes(payloadJson));
                        string xVerify = GenerateXVerify(base64Payload, "/pg/v1/pay", apiKey) + "###" + apiKeyIndex;

                        var response = new
                        {
                            success = true,
                            redirectUrl = $"{hostUrl}/pg/v1/pay?payload={base64Payload}&X-VERIFY={xVerify}"
                        };

                        return JsonConvert.SerializeObject(response);
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { success = false, message = ex.Message });
            }

            return JsonConvert.SerializeObject(new { success = false });
        }

        private string GenerateXVerify(string payload, string url, string apiKey)
        {
            string data = payload + url + apiKey;
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }

        [WebMethod(EnableSession = true)]
        public void HandleCallback()
        {
            var request = HttpContext.Current.Request;
            var responseBody = new System.IO.StreamReader(request.InputStream).ReadToEnd();

            dynamic response = JsonConvert.DeserializeObject(responseBody);
            string transactionId = response.transactionId;
            string status = response.status;

            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            using (con = new SqlConnection(constr))
            {
                con.Open();
                cmd = new SqlCommand("UPDATE TB_DonationAmount SET paymentStatus = @status, ReferenceNumber = @ReferenceNumber WHERE TransactionId = @TransactionId", con);

                cmd.Parameters.AddWithValue("status", status);
                cmd.Parameters.AddWithValue("ReferenceNumber", response.referenceNumber);
                cmd.Parameters.AddWithValue("TransactionId", transactionId);

                cmd.ExecuteNonQuery();
            }
        }

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod]
         protected void Page_Load(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            HttpContext.Current.Response.AppendHeader("Pragma", "no-cache");
            HttpContext.Current.Response.AppendHeader("Expires", "0");
        }


        [WebMethod(EnableSession = true)]
        public string newUserRegistrationWeb(string name, string sname, string gender, string batchno, string dob, string mobile, string email, string pwd,string CountryCode)
        {
            
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    int res = 0;

                    // Check if the user already exists
                    cmd.CommandText = "SELECT COUNT(*) FROM TB_Users WHERE Email = @eml";
                    cmd.Parameters.AddWithValue("eml", email);
                    int existingUserCount = (int)cmd.ExecuteScalar();
                    cmd.Parameters.Clear();

                    if (existingUserCount > 0)
                    {
                        con.Close();
                        return oSerializer.Serialize("User already registered");
                    }
                    else
                    {

                        cmd.CommandText = "select *from TB_Users where Mobile=@mb";
                        cmd.Parameters.AddWithValue("mb", mobile);
                        rdr = cmd.ExecuteReader();
                        int exis = 0;
                        while (rdr.Read())
                        {
                            exis = 2;
                        }
                        rdr.Close();
                        cmd.Parameters.Clear();
                        if (exis == 2)
                        {
                            cmd.Parameters.Clear();
                            con.Close();
                            return oSerializer.Serialize("Mobile No. Already Used");
                        }

                        // Configure SMTP client gmail to gmail
                        SmtpClient client = new SmtpClient("smtp.gmail.com");
                        client.Port = 587;
                        client.EnableSsl = true;
                        client.Credentials = new NetworkCredential("jnvvkaa@gmail.com", "qeayxyyaoeytypvw");

                        // Create email message
                        MailMessage message = new MailMessage();
                        message.From = new MailAddress("jnvvkaa@gmail.com");
                        message.To.Add("cakprasen@gmail.com");
                        message.Subject = $"New User Registered from Batch: {batchno} - {sname} {name}";
                        message.Body = $"New user registered with the following details:\nName: {sname} {name}\nBatch Number: {batchno}\nDate of Birth: {dob}\nMobile Number: {CountryCode}{mobile}\nEmail: {email}";

                        // Send email
                        client.Send(message);

                        //  bgroup, string aadhar, string pan, string marital, string ifsc, string bankname, string micr, string bbranch, string bcontact, string bcity, string bdistrict, string bstate, string baddress                                                                                             

                        cmd.CommandText = "insert into TB_Users(Datee,Name,Surname,Gender,BatchNo,DOB,Mobile,Email,Pwd,UStatus,WorkingAs,country_code ) OUTPUT inserted.RowId values(@Datee,@Name,@Surname,@Gender,@BatchNo,@DOB,@Mobile,@Email,@Pwd,-1,1,@CountryCode)";
                        cmd.Parameters.AddWithValue("Datee", DateTime.Now);
                        cmd.Parameters.AddWithValue("Name", name);
                        cmd.Parameters.AddWithValue("Surname", sname);
                        cmd.Parameters.AddWithValue("Gender", gender);
                        cmd.Parameters.AddWithValue("BatchNo", batchno);
                        cmd.Parameters.AddWithValue("DOB", dob);
                        cmd.Parameters.AddWithValue("Mobile", mobile);
                        cmd.Parameters.AddWithValue("Email", email);
                        cmd.Parameters.AddWithValue("Pwd", pwd);
                        cmd.Parameters.AddWithValue("CountryCode", CountryCode);
                        //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                        res = (int)cmd.ExecuteScalar();
                        cmd.Parameters.Clear();
                        string mid = "";
                        if (res <= 9)
                        {
                            mid = "JN590" + res.ToString();
                        }
                        else
                            mid = "JN59" + res.ToString();
                        cmd.CommandText = "update TB_Users set UserId=@mid where RowId=@rid";
                        cmd.Parameters.AddWithValue("mid", mid);
                        cmd.Parameters.AddWithValue("rid", res);
                        cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                        try
                        {
                            if (res > 0)
                            {
                                con.Close();
                                Session["uid"] = mid;
                                Session["cname"] = name + "." + sname;
                                Session["email"] = email;
                                return new JavaScriptSerializer().Serialize("Account Created! Successfully.");
                                //return oSerializer.Serialize("1");

                            }
                            else
                            {
                                con.Close();
                                return new JavaScriptSerializer().Serialize("520");
                                //return oSerializer.Serialize("520");
                            }
                        }
                        catch (Exception ex)
                        {
                            return new JavaScriptSerializer().Serialize("-3" + ex.Message);
                            //return oSerializer.Serialize("-3" + ex.Message);
                        }

                    }
                }
                catch (Exception ex)
                {
                    return new JavaScriptSerializer().Serialize("-1" + ex.Message);
                    //return oSerializer.Serialize("-1" + ex.Message);
                }
                /*}
                catch (Exception ex)
                {
                    return oSerializer.Serialize("-1" + ex.Message);
                }*/

            }

        }

        public class UserClass
        {
            public string uid { get; set; }
            public string fname { get; set; }
            public string sname { get; set; }
            public string batchno { get; set; }
            public string ustatus { get; set; }
            public string uphno { get; set; }
            public string uemail { get; set; }
            public string jnvkdesign { get; set; }
            public string adminStatus { get; set; }
            public string country_code { get; set; }
            public string callDispo { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string authenticateUser(string ph, string pwd)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);


                    cmd.CommandText = "select * from TB_Users where (Mobile=@mb or Email=@email)";
                    cmd.Parameters.AddWithValue("mb", ph);
                    cmd.Parameters.AddWithValue("email", ph);
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {

                        string dbPassword = rdr["Pwd"].ToString();

                        // Perform case-sensitive comparison for the password
                        if (string.Equals(dbPassword, pwd, StringComparison.Ordinal))
                        {

                            if (rdr["UStatus"].ToString().Equals("1"))
                            {
                                uClass = new UserClass();
                                uClass.uid = rdr["UserId"].ToString();
                                uClass.fname = rdr["Name"].ToString();
                                uClass.sname = rdr["SurName"].ToString();
                                uClass.ustatus = rdr["UStatus"].ToString();
                                Session["userid"] = rdr["UserId"].ToString();
                                Session["email"] = rdr["Email"].ToString();
                                Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                                Session["batchno"] = rdr["BatchNo"].ToString();
                                Session["desig"] = "0";
                                Session["isAdmin"] = "0";
                                if (rdr["AdminStatus"] != DBNull.Value)
                                    Session["desig"] = uClass.jnvkdesign = rdr["AdminStatus"].ToString();
                                else
                                    uClass.jnvkdesign = "1";
                                uClassList.Add(uClass);
                            }
                            else
                            {
                                uClass = new UserClass();
                                uClass.ustatus = rdr["UStatus"].ToString();
                                uClassList.Add(uClass);
                            }
                        }
                        else
                        {
                            // Handle incorrect password
                            uClass = new UserClass();
                            uClass.ustatus = "523"; // Unauthorized status
                            uClass.fname = "Password is Case-Sensitive";
                            uClassList.Add(uClass);
                        }

                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string authenticateAdmin(string ph, string pwd)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();
            using (con = new SqlConnection(constr))
            {
               try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where Mobile=@mb or Email=@email and Pwd=@p and AdminStatus=1";
                    cmd.Parameters.AddWithValue("mb", ph);
                    cmd.Parameters.AddWithValue("email", ph);
                    cmd.Parameters.AddWithValue("p", pwd);
                    rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        if (rdr["UStatus"].ToString().Equals("1"))
                        {
                            uClass = new UserClass();
                            uClass.uid = rdr["UserId"].ToString();
                            uClass.fname = rdr["Name"].ToString();
                            uClass.sname = rdr["SurName"].ToString();
                            uClass.adminStatus = rdr["AdminStatus"].ToString();
                            uClass.ustatus = rdr["UStatus"].ToString();
                            Session["userid"] = rdr["UserId"].ToString();
                            Session["email"] = rdr["Email"].ToString();
                            Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                            Session["batchno"] = rdr["BatchNo"].ToString();
                            if (rdr["WorkingAs"] != DBNull.Value)
                                uClass.jnvkdesign = rdr["WorkingAs"].ToString();
                            else
                                uClass.jnvkdesign = "1";
                            Session["isAdmin"] = "1";
                            uClassList.Add(uClass);
                        }
                        else
                        {
                            uClass = new UserClass();
                            uClass.ustatus = rdr["UStatus"].ToString();
                            uClassList.Add(uClass);
                        }
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
               catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string authenticateBatchAdmin(string ph, string pwd)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();
            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where Mobile=@mb or Email=@email and Pwd=@p and AdminStatus>0";
                    cmd.Parameters.AddWithValue("mb", ph);
                    cmd.Parameters.AddWithValue("email", ph);
                    cmd.Parameters.AddWithValue("p", pwd);
                    rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        if (rdr["UStatus"].ToString().Equals("1"))
                        {
                            uClass = new UserClass();
                            uClass.uid = rdr["UserId"].ToString();
                            uClass.fname = rdr["Name"].ToString();
                            uClass.sname = rdr["SurName"].ToString();
                            uClass.adminStatus = rdr["AdminStatus"].ToString();
                            uClass.ustatus = rdr["UStatus"].ToString();
                            Session["userid"] = rdr["UserId"].ToString();
                            Session["email"] = rdr["Email"].ToString();
                            Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                            Session["batchno"] = rdr["BatchNo"].ToString();
                            if (rdr["WorkingAs"] != DBNull.Value)
                                uClass.jnvkdesign = rdr["WorkingAs"].ToString();
                            else
                                uClass.jnvkdesign = "1";
                            Session["isAdmin"] = "1";
                            uClassList.Add(uClass);
                        }
                        else
                        {
                            uClass = new UserClass();
                            uClass.ustatus = rdr["UStatus"].ToString();
                            uClassList.Add(uClass);
                        }
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getUsername()
        {
            if (Session != null)
            {
                if (Session["uname"] != null)
                    return Session["uname"].ToString();
                else
                    return "-1";//login
            }
            else
                return "-2";//login redirect 
        }

        [WebMethod(EnableSession = true)]
        public string getUserAcessLevel()
        {
            if (Session != null)
            {
                if (Session["isAdmin"] != null)
                {
                    return Session["isAdmin"].ToString();
                }
                else
                    return "-1";//login
            }
            else
                return "-2";//login redirect 
        }

        // admin module
        [WebMethod(EnableSession = true)]
        public string getAllusers(string utype , string batchNo, string calldispo)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    if (Convert.ToInt32(calldispo) == -1)
                    {

                        if (Convert.ToInt32(batchNo) == 0)
                        {

                            switch (Convert.ToInt32(utype))
                            {
                                case 0:
                                    cmd.CommandText = "select * from TB_Users where UStatus=0  order by BatchNo";
                                    break;
                                case 1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=1 order by BatchNo";
                                    break;
                                case 2:
                                    cmd.CommandText = "select * from TB_Users order by BatchNo";
                                    break;
                                case -1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=-1 or UStatus=-2  order by BatchNo";
                                    break;
                            }
                        }
                        else
                        {
                            switch (Convert.ToInt32(utype))
                            {
                                case 0:
                                    cmd.CommandText = "select * from TB_Users where UStatus=0 and  BatchNo=@batchno";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    break;
                                case 1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=1 and  BatchNo=@batchno";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    break;
                                case 2:
                                    cmd.CommandText = "select * from TB_Users where  BatchNo=@batchno";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    break;
                                case -1:
                                    cmd.CommandText = "select * from TB_Users where (UStatus=-1 or UStatus=-2)  and  BatchNo=@batchno";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    break;
                            }


                        }
                    }
                    else
                    {
                        if (Convert.ToInt32(batchNo) == 0)
                        {

                            switch (Convert.ToInt32(utype))
                            {
                                case 0:
                                    cmd.CommandText = "select * from TB_Users where UStatus=0 and CallDispo=@calldispo order by BatchNo";
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case 1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=1 and CallDispo=@calldispo order by BatchNo";
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case 2:
                                    cmd.CommandText = "select * from TB_Users where CallDispo=@calldispo order by BatchNo";
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case -1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=-1 or UStatus=-2 and CallDispo=@calldispo order by BatchNo";
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                            }
                        }
                        else
                        {
                            switch (Convert.ToInt32(utype))
                            {
                                case 0:
                                    cmd.CommandText = "select * from TB_Users where UStatus=0 and  BatchNo=@batchno and CallDispo=@calldispo";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case 1:
                                    cmd.CommandText = "select * from TB_Users where UStatus=1 and  BatchNo=@batchno and CallDispo=@calldispo";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case 2:
                                    cmd.CommandText = "select * from TB_Users where  BatchNo=@batchno and CallDispo=@calldispo";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                                case -1:
                                    cmd.CommandText = "select * from TB_Users where (UStatus=-1 or UStatus=-2)  and  BatchNo=@batchno and CallDispo=@calldispo";
                                    cmd.Parameters.AddWithValue("batchno", batchNo);
                                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                                    break;
                            }


                        }
                    }

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        uClass = new UserClass();
                        uClass.uid = rdr["UserId"].ToString();
                        uClass.fname = rdr["Name"].ToString();
                        uClass.sname = rdr["SurName"].ToString();
                        uClass.ustatus = rdr["UStatus"].ToString();
                        uClass.uphno = rdr["Mobile"].ToString();
                        uClass.uemail = rdr["Email"].ToString();
                        uClass.batchno = rdr["BatchNo"].ToString();
                        uClass.country_code = rdr["country_code"].ToString();
                        uClass.callDispo = rdr["CallDispo"].ToString();
                        /*Session["userid"] = rdr["UserId"].ToString();
                        Session["uname"] = rdr["Name"].ToString(); //[0] + ". " + rdr["SurName"].ToString();
                        Session["batchno"] = rdr["BatchNo"].ToString();*/
                        uClassList.Add(uClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        // admin module
        [WebMethod(EnableSession = true)]
        public string getAllBatchusers(string utype)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    if (Session["batchno"] != null)
                    {

                        switch (Convert.ToInt32(utype))
                        {
                            case 0:
                                cmd.CommandText = "select * from TB_Users where UStatus=0 and  BatchNo=@batchno";
                                cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                                break;
                            case 1:
                                cmd.CommandText = "select * from TB_Users where UStatus=1 and  BatchNo=@batchno";
                                cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                                break;
                            case 2:
                                cmd.CommandText = "select * from TB_Users where  BatchNo=@batchno";
                                cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                                break;
                            case -1:
                                cmd.CommandText = "select * from TB_Users where  order by BatchNo";
                                cmd.CommandText = "select * from TB_Users where (UStatus=-1 or UStatus=-2)  and  BatchNo=@batchno";
                                cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                                break;
                        }
                    }

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        uClass = new UserClass();
                        uClass.uid = rdr["UserId"].ToString();
                        uClass.fname = rdr["Name"].ToString();
                        uClass.sname = rdr["SurName"].ToString();
                        uClass.ustatus = rdr["UStatus"].ToString();
                        uClass.uphno = rdr["Mobile"].ToString();
                        uClass.uemail = rdr["Email"].ToString();
                        uClass.batchno = rdr["BatchNo"].ToString();
                        uClass.country_code = rdr["country_code"].ToString();
                        /*Session["userid"] = rdr["UserId"].ToString();
                        Session["uname"] = rdr["Name"].ToString(); //[0] + ". " + rdr["SurName"].ToString();
                        Session["batchno"] = rdr["BatchNo"].ToString();*/
                        uClassList.Add(uClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getuserInfo(string uid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserClass uClass;
            List<UserClass> uClassList = new List<UserClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users order by BatchNo";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        uClass = new UserClass();
                        uClass.uid = rdr["UserId"].ToString();
                        uClass.fname = rdr["Name"].ToString();
                        uClass.sname = rdr["SurName"].ToString();
                        uClass.ustatus = rdr["UStatus"].ToString();
                        uClass.uphno = rdr["Mobile"].ToString();
                        uClass.uemail = rdr["Email"].ToString();
                        uClass.batchno = rdr["BatchNo"].ToString();
                        Session["userid"] = rdr["UserId"].ToString();
                        Session["email"] = rdr["Email"].ToString();
                        Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                        Session["batchno"] = rdr["BatchNo"].ToString();
                        uClassList.Add(uClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uClass = new UserClass();
                        uClass.ustatus = "521";
                        uClass.fname = "";
                        uClassList.Add(uClass);
                        var json = JsonConvert.SerializeObject(uClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uClass = new UserClass();
                    uClass.ustatus = "522";
                    uClass.fname = ex.Message;
                    uClassList.Add(uClass);
                    var json = JsonConvert.SerializeObject(uClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        //Functionality to Get user data using uid  for EditUser File
        public class UserDataClass
        {
            public string uid { get; set; }
            public string uprofile { get; set; }
            public string fname { get; set; }
            public string sname { get; set; }
            public string gender { get; set; }
            public string dob { get; set; }
            public string marriagestatus { get; set; }
            public string bgroup { get; set; }
            public string uphno { get; set; }
            public string uemail { get; set; }
            public string ucity { get; set; }
            public string profession { get; set; }
            public string workingin { get; set; }
            public string lclass { get; set; }
            public string workingas { get; set; }// designation in JNVK
            public string jnvkdesign { get; set; }// designation in JNVK
            public string ubio { get; set; }
            public string photo { get; set; }
            public string ustatus { get; set; }
            public string instaurl { get; set; }
            public string fbookurl { get; set; }
            public string linkdnurl { get; set; }
            public string calldispo { get; set; }
            public string designation { get; set; }
            public string medinsuexp { get; set; }
            public string medinsupro { get; set; }
            public string expertin { get; set; }
            public string native { get; set; }
            public string batchNo { get; set; }
            public string hob2 { get; set; }
            public string country_code { get; set; }
            public string uadminnotes { get; set; }
            public string auserupdatedon { get; set; }
            public string auserupdated { get; set; }
            public string uadminnoteddate { get; set; }
            public string calldispodate { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string getuserdata(string uid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserDataClass uData;
            List<UserDataClass> uDataList = new List<UserDataClass>();

            if (Session["userid"] != null)
            {
                using (con = new SqlConnection(constr))
                {
                    //try
                    //{
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where UserId=@uid;";
                    if (uid.Equals("0"))
                        cmd.Parameters.AddWithValue("uid", Session["userid"].ToString());
                    else
                        cmd.Parameters.AddWithValue("uid", uid);
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        uData = new UserDataClass();
                        uData.uid = rdr["UserId"].ToString();
                        uData.photo = rdr["Photo"].ToString();
                        uData.fname = rdr["Name"].ToString();
                        uData.sname = rdr["SurName"].ToString();
                        uData.ustatus = rdr["UStatus"].ToString();
                        uData.calldispo = rdr["CallDispo"].ToString();
                        uData.uphno = rdr["Mobile"].ToString();
                        uData.uemail = rdr["Email"].ToString();

                        if(rdr["Gender"]==DBNull.Value)
                        uData.gender = "0";
                        else
                            uData.gender = rdr["Gender"].ToString();

                        uData.dob = rdr["DOB"].ToString();

                        if (rdr["MaritalStatus"] == DBNull.Value)
                            uData.marriagestatus = "0";
                        else
                            uData.marriagestatus = rdr["MaritalStatus"].ToString();

                        if (rdr["BloodGroup"] == DBNull.Value)
                            uData.bgroup = "0";
                        else
                            uData.bgroup = rdr["BloodGroup"].ToString();

                        if (rdr["JNVLastClass"] == DBNull.Value)
                            uData.lclass = "0";
                        else
                            uData.lclass = rdr["JNVLastClass"].ToString();
                        
                        uData.profession = rdr["Profession"].ToString();
                        uData.ucity = rdr["City"].ToString();
                        uData.workingin = rdr["WorkingIn"].ToString();
                        uData.workingas = rdr["WorkingAs"].ToString();
                        uData.ubio = rdr["Biodata"].ToString();
                        uData.uadminnotes = rdr["AdminNotes"].ToString();
                        uData.uadminnoteddate = rdr["AdminNotedDate"].ToString();
                        uData.auserupdated = rdr["UserUpdated"].ToString();
                        uData.auserupdatedon = rdr["UserUpdatedOn"].ToString();
                        uData.calldispodate = rdr["CallDispoDate"].ToString();
                        uData.instaurl = rdr["InstaUrl"].ToString();
                        uData.fbookurl = rdr["FbookUrl"].ToString();
                        uData.linkdnurl = rdr["LinkdnUrl"].ToString();

                        if (rdr["Designation"] == DBNull.Value)
                            uData.designation = "Select Designation";
                        else
                            uData.designation = rdr["Designation"].ToString();


                        if (rdr["MedicalInsuranceExpiry"] == DBNull.Value)
                            uData.medinsuexp = "";
                        else
                            uData.medinsuexp = Convert.ToDateTime(rdr["MedicalInsuranceExpiry"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");

                        uData.medinsupro = rdr["MedicalInsuranceProvider"].ToString();
                        uData.expertin = rdr["ExpertIn"].ToString();
                        uData.native = rdr["NativePlace"].ToString();
                        uData.hob2 = rdr["Hobbies2"].ToString();
                        uData.batchNo = rdr["BatchNo"].ToString();
                        uData.country_code = rdr["country_code"].ToString();

                        uDataList.Add(uData);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (uDataList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(uDataList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        uData = new UserDataClass();
                        uData.ustatus = "521";
                        uData.fname = "";
                        uDataList.Add(uData);
                        var json = JsonConvert.SerializeObject(uDataList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    /*}
                    catch (Exception ex)
                    {
                        Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                        uData = new UserDataClass();
                        uData.ustatus = "522";
                        uData.fname = ex.Message;   
                        uDataList.Add(uData);
                        var json = JsonConvert.SerializeObject(uDataList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }*/
                }
            }
            else
            {
                uData = new UserDataClass();
                uData.ustatus = "520";
                uData.fname = "";
                uDataList.Add(uData);
                var json = JsonConvert.SerializeObject(uDataList);
                retval = json.ToString();
                return oSerializer.Serialize(retval);
            }
        }


        [WebMethod(EnableSession = true)]
        public string updateProfilePic(string uid, string baseval)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            if (Session["userid"] != null)
            {
                using (con = new SqlConnection(constr))
                {
                    try
                    {
                        con.Open();
                        cmd = new SqlCommand("", con);

                        cmd.CommandText = "update TB_Users set Photo=@baseval where UserId=@uid";
                        cmd.Parameters.AddWithValue("baseval", baseval);
                        if (uid.Equals("0"))
                            cmd.Parameters.AddWithValue("uid", Session["userid"].ToString());
                        else
                            cmd.Parameters.AddWithValue("uid", uid);
                        int res = cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                        con.Close();
                        if (res > 0)
                            return oSerializer.Serialize("1");
                        else
                            return oSerializer.Serialize("0");
                    }
                    catch (Exception ex)
                    {

                        return oSerializer.Serialize("-1" + ex.Message);
                    }
                }
            }
            else
                return oSerializer.Serialize("520");
        }

        //update User status for account code is here
        [WebMethod(EnableSession = true)]
        public string updateUserStatus(string uid, string ustatus, string email, string sname, string fname)
        {

            // Configure SMTP client
            //SmtpClient client = new SmtpClient("smtp.gmail.com");
            //client.Port = 587;
            //client.EnableSsl = true;
            //client.Credentials = new NetworkCredential("jnvvkaa@gmail.com", "qeayxyyaoeytypvw");

            // Create email message
            //MailMessage message = new MailMessage();
            //message.From = new MailAddress("jnvvkaa@gmail.com");
            //message.To.Add(email);
            //message.Subject = $"Congratulations {sname} {fname}, Your Account is Activated! and Please Reply As jnvkaa for mail confirmation";
            //message.Body = $"Hello dear {sname} {fname}\n\nWe're thrilled to inform you that your account on our website, https://jnvkaa.org/, has been successfully activated.\n\n" +
            //    $"To confirm your Mail Id Please Reply as JNVKAA\n\n" +
            //    $"Welcome aboard!\n\nBest regards,\nJawahar Navodaya Vidyalaya Krishna Alumni Association (JNVKAA)";

            // Send email
            //client.Send(message);

            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Users set UStatus=@ustatus, ActivatedBy=@userid, ActivatedOn=@activatedon where UserId=@uid";
                    cmd.Parameters.AddWithValue("ustatus", ustatus);
                    cmd.Parameters.AddWithValue("uid", uid);
                    cmd.Parameters.AddWithValue("activatedon", DateTime.Now);
                    cmd.Parameters.AddWithValue("userid", Session["userid"].ToString());
                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                        return oSerializer.Serialize("1");
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        //update User status for account code is here
        [WebMethod(EnableSession = true)]
        public string updatecalldispoStatus(string uid, string calldispo)
        {


            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Users set CallDispo=@calldispo, CallMadeBy=@userid, CallDispoDate=@calldispodate where UserId=@uid";
                    cmd.Parameters.AddWithValue("calldispo", calldispo);
                    cmd.Parameters.AddWithValue("uid", uid);
                    cmd.Parameters.AddWithValue("calldispodate", DateTime.Now);
                    cmd.Parameters.AddWithValue("userid", Session["userid"].ToString());
                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                        return oSerializer.Serialize("1");
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateUserData(string uid, string fname, string sname, string gender, string dob, string maritalstatus, string bgroup, string phno, string email, string city, string profession, string designation, string workingin, string lclass, string workingas, string bio, string adminnotes, string instaurl, string fbookurl, string medicalInsurProvi,string medicalInsurExpire,string ExpertIn, string linkdnurl, string batchNo, string native, string userupdated, string country_code)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Users set Name=@fname, Surname=@sname, Gender=@gender, DOB=@dob, MaritalStatus=@maritalstatus, BloodGroup=@bgroup, Mobile=@phno, Email=@email, City=@city, Profession=@profession, Designation=@designation, WorkingIn=@workingin, JNVLastClass=@lclass, WorkingAs=@workingas, Biodata=@bio, AdminNotes=@adminnotes, AdminNotedDate=@adminnoteddate, UserUpdated=@userupdated, InstaUrl=@instaurl, FbookUrl=@fbookurl, LinkdnUrl=@linkdnurl, MedicalInsuranceProvider=@medicalInsurP, ExpertIn=@expertIn, MedicalInsuranceExpiry=@medicalInsExp, BatchNo=@batchNo, NativePlace=@native, country_code=@country_code where UserId=@uid";
                    cmd.Parameters.AddWithValue("uid", uid);
                    cmd.Parameters.AddWithValue("adminnoteddate", DateTime.Now);
                    cmd.Parameters.AddWithValue("fname", fname);
                    cmd.Parameters.AddWithValue("sname", sname);
                    cmd.Parameters.AddWithValue("gender", gender);
                    cmd.Parameters.AddWithValue("dob", dob);
                    cmd.Parameters.AddWithValue("maritalstatus", maritalstatus);
                    cmd.Parameters.AddWithValue("bgroup", bgroup);
                    cmd.Parameters.AddWithValue("phno", phno);
                    cmd.Parameters.AddWithValue("email", email);
                    cmd.Parameters.AddWithValue("city", city);
                    cmd.Parameters.AddWithValue("profession", profession);
                    cmd.Parameters.AddWithValue("designation", designation);
                    cmd.Parameters.AddWithValue("workingin", workingin);
                    cmd.Parameters.AddWithValue("lclass", lclass);
                    cmd.Parameters.AddWithValue("workingas", workingas);
                    cmd.Parameters.AddWithValue("bio", bio);
                    cmd.Parameters.AddWithValue("adminnotes", adminnotes);
                    cmd.Parameters.AddWithValue("instaurl", instaurl);
                    cmd.Parameters.AddWithValue("fbookurl", fbookurl);
                    cmd.Parameters.AddWithValue("linkdnurl", linkdnurl);
                    cmd.Parameters.AddWithValue("medicalInsurP", medicalInsurProvi);
                    cmd.Parameters.AddWithValue("expertIn", ExpertIn);
                    cmd.Parameters.AddWithValue("batchNo", batchNo);
                    cmd.Parameters.AddWithValue("native", native);
                    cmd.Parameters.AddWithValue("userupdated", userupdated);
                    cmd.Parameters.AddWithValue("country_code", country_code);
                    cmd.Parameters.AddWithValue("medicalInsExp", medicalInsurExpire);
                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                        return oSerializer.Serialize("1");
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getProfilePic(string uid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            string baseval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            if (Session["userid"] != null)
            {
                using (con = new SqlConnection(constr))
                {
                    //try
                    //{
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "select Photo from TB_Users where UserId=@uid";
                    cmd.Parameters.AddWithValue("uid", Session["userid"].ToString());
                    System.Diagnostics.Debug.WriteLine("VIRTUAL: " + Session["userid"].ToString());

                    rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                        baseval = rdr["Photo"].ToString();
                    rdr.Close();
                    cmd.Parameters.Clear();
                    con.Close();
                    return oSerializer.Serialize(baseval);
                    /*}
                    catch (Exception ex)
                    {
                        var json = JsonConvert.SerializeObject(stClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize("-1");// + ex.Message);
                    }*/
                }
            }
            else
                return oSerializer.Serialize("520");
        }

        //Events Functionality Code is Here
        [WebMethod(EnableSession = true)]
        public string addEvent(string title, string date, string time, string location, string organizedby, string description, string descdetails, string locationLink, string photo)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {

                //try
                //{
                /* con.Open();
                 cmd = new SqlCommand("", con);
                 int res = 0;
                 cmd.CommandText = "select *from TB_Events where ";
                 cmd.Parameters.AddWithValue("mb", mobile);
                 rdr = cmd.ExecuteReader();
                 int exis = 0;
                 while (rdr.Read())
                 {
                     exis = 2;
                 }
                 rdr.Close();
                 cmd.Parameters.Clear();
                 if (exis == 2)
                 {
                     cmd.Parameters.Clear();
                     con.Close();
                     return oSerializer.Serialize("2");
                 }*/
                //  bgroup, string aadhar, string pan, string marital, string ifsc, string bankname, string micr, string bbranch, string bcontact, string bcity, string bdistrict, string bstate, string baddress                                                                                             
                try
                {
                    con.Open();
                    int res = 0;
                    cmd = new SqlCommand("", con);


                    cmd.CommandText = "insert into TB_Events(Title,Datee,Tyme,Location,OrganizedBy,Description,DescDetail,LocationLink,EventStatus,Photo) OUTPUT inserted.RowId values(@title,@date,@time,@location,@organizedby,@description,@descdetails,@locationlink,1,@photo)";
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("date", date);
                    cmd.Parameters.AddWithValue("time", time);
                    cmd.Parameters.AddWithValue("location", location);
                    cmd.Parameters.AddWithValue("organizedby", organizedby);
                    cmd.Parameters.AddWithValue("description", description);
                    cmd.Parameters.AddWithValue("descdetails", descdetails);
                    cmd.Parameters.AddWithValue("locationlink", locationLink);
                    cmd.Parameters.AddWithValue("photo", photo);
                    //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                    res = (int)cmd.ExecuteScalar();
                    cmd.Parameters.Clear();
                    string mid = "";
                    if (res <= 9)
                    {
                        mid = "Event0" + res.ToString();
                    }
                    else
                        mid = "Event" + res.ToString();
                    cmd.CommandText = "update TB_Events set EventId=@mid where RowId=@rid";
                    cmd.Parameters.AddWithValue("mid", mid);
                    cmd.Parameters.AddWithValue("rid", res);
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    try
                    {
                        if (res > 0)
                        {
                            con.Close();
                            /*Session["uid"] = mid;
                            Session["cname"] = name + "." + sname;*/
                            return oSerializer.Serialize("1");
                        }
                        else
                        {
                            con.Close();
                            return oSerializer.Serialize("520");
                        }
                    }
                    catch (Exception ex)
                    {
                        return oSerializer.Serialize("-3" + ex.Message);
                    }

                }
                catch (Exception ex)
                {
                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        public class UserEventClass
        {
            public string eventid { get; set; }
            public string title { get; set; }
            public string date { get; set; }
            public string time { get; set; }
            public string location { get; set; }
            public string photo { get; set; }
            public string orgnizedby { get; set; }
            public string description { get; set; }
            public string descdetails { get; set; }
            public string locationurl { get; set; }
            public string eventStatus { get; set; }
        }
        [WebMethod(EnableSession = true)]
        public string GetEvent(string eventid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserEventClass Event;
            List<UserEventClass> EventList = new List<UserEventClass>();



            using (con = new SqlConnection(constr))
            {
                //try
                //{
                con.Open();
                cmd = new SqlCommand("", con);
                cmd.CommandText = "select * from TB_Events where EventId=@eventid;";
                cmd.Parameters.AddWithValue("eventid", eventid);
                rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    Event = new UserEventClass();
                    Event.eventid = rdr["EventId"].ToString();
                    Event.title = rdr["Title"].ToString();
                    Event.date = Convert.ToDateTime(rdr["Datee"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                    Event.time = rdr["Tyme"].ToString();
                    Event.photo = rdr["Photo"].ToString();
                    Event.location = rdr["Location"].ToString();
                    Event.orgnizedby = rdr["OrganizedBy"].ToString();
                    Event.description = rdr["Description"].ToString();
                    Event.descdetails = rdr["DescDetail"].ToString();
                    Event.locationurl = rdr["LocationLink"].ToString();
                    Event.eventStatus = rdr["EventStatus"].ToString();


                    EventList.Add(Event);
                }
                rdr.Close();
                cmd.Parameters.Clear();
                if (EventList.Count > 0)
                {
                    int result = 0;

                    con.Close();
                    var json = JsonConvert.SerializeObject(EventList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
                else
                {
                    con.Close();
                    Event = new UserEventClass();
                    Event.eventid = "521";
                    Event.title = "";
                    EventList.Add(Event);
                    var json = JsonConvert.SerializeObject(EventList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
                /*}
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uData = new UserDataClass();
                    uData.ustatus = "522";
                    uData.fname = ex.Message;   
                    uDataList.Add(uData);
                    var json = JsonConvert.SerializeObject(uDataList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }*/
            }
        }


        public class AllEventsClass
        {
            public string eventid { get; set; }
            public string title { get; set; }
            public string photo { get; set; }
            public string date { get; set; }
            public string time { get; set; }
            public string location { get; set; }
            public string organizedby { get; set; }
            public string LocationLink { get; set; }
            public string EventStatus { get; set; }
            public string description { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string getAllEvents()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            AllEventsClass allEvents;
            List<AllEventsClass> AllEventsList = new List<AllEventsClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Events order by Datee desc";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        allEvents = new AllEventsClass();
                        allEvents.eventid = rdr["EventId"].ToString();
                        allEvents.title = rdr["Title"].ToString();
                        allEvents.time = rdr["Tyme"].ToString();
                        allEvents.date = Convert.ToDateTime(rdr["Datee"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        allEvents.location = rdr["Location"].ToString();
                        allEvents.photo = rdr["Photo"].ToString();
                        allEvents.LocationLink = rdr["LocationLink"].ToString();
                        allEvents.organizedby = rdr["OrganizedBy"].ToString();
                        allEvents.EventStatus = rdr["EventStatus"].ToString();
                        allEvents.description = rdr["Description"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        AllEventsList.Add(allEvents);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (AllEventsList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(AllEventsList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        allEvents = new AllEventsClass();
                        allEvents.title = "521";
                        allEvents.location = "";
                        AllEventsList.Add(allEvents);
                        var json = JsonConvert.SerializeObject(AllEventsList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    allEvents = new AllEventsClass();
                    allEvents.title = "522";
                    allEvents.location = "";
                    AllEventsList.Add(allEvents);
                    var json = JsonConvert.SerializeObject(AllEventsList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getEventChoose(string getEvent)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            AllEventsClass allEvents;
            List<AllEventsClass> AllEventsList = new List<AllEventsClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    switch(Convert.ToInt16(getEvent)){
                        case 0:
                    cmd.CommandText = "select * from TB_Events order by Datee desc";
                    break;
                        case 1:
                    cmd.CommandText = "SELECT * FROM TB_Events WHERE Datee > @date;";
                          cmd.Parameters.AddWithValue("date",DateTime.Now);
                    break;
                        case 2:
                    cmd.CommandText = "SELECT * FROM TB_Events WHERE Datee > @date;";
                    cmd.Parameters.AddWithValue("date", DateTime.Now);
                    break;
                        case 3:
                    cmd.CommandText = "SELECT * FROM TB_Events WHERE EventStatus=2";
                    break;
                }
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        allEvents = new AllEventsClass();
                        allEvents.eventid = rdr["EventId"].ToString();
                        allEvents.title = rdr["Title"].ToString();
                        allEvents.time = rdr["Tyme"].ToString();
                        allEvents.date = Convert.ToDateTime(rdr["Datee"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        allEvents.location = rdr["Location"].ToString();
                        allEvents.photo = rdr["Photo"].ToString();
                        allEvents.LocationLink = rdr["LocationLink"].ToString();
                        allEvents.organizedby = rdr["OrganizedBy"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        AllEventsList.Add(allEvents);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (AllEventsList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(AllEventsList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        allEvents = new AllEventsClass();
                        allEvents.eventid = "521";
                        allEvents.location = "";
                        AllEventsList.Add(allEvents);
                        var json = JsonConvert.SerializeObject(AllEventsList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    allEvents = new AllEventsClass();
                    allEvents.eventid = "522";
                    allEvents.location = "";
                    AllEventsList.Add(allEvents);
                    var json = JsonConvert.SerializeObject(AllEventsList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateEventData(string eventid, string title, string date, string time, string location, string organizedby, string description, string descdetails, string locationLink,string EventStatus)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Events set Title=@title, Datee=@date, Tyme=@time, Location=@location,OrganizedBy=@organizedby, Description=@description,DescDetail=@descdetail,EventStatus=@eventStatus, LocationLink=@locationlink where EventId=@eventid;";
                    cmd.Parameters.AddWithValue("eventid", eventid);
                    cmd.Parameters.AddWithValue("title", title);
                    cmd.Parameters.AddWithValue("date", date);
                    cmd.Parameters.AddWithValue("time", time);
                    cmd.Parameters.AddWithValue("location", location);
                    cmd.Parameters.AddWithValue("organizedby", organizedby);
                    cmd.Parameters.AddWithValue("description", description);
                    cmd.Parameters.AddWithValue("descdetail", descdetails);
                    cmd.Parameters.AddWithValue("locationlink", locationLink);
                    cmd.Parameters.AddWithValue("eventStatus", EventStatus);


                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                        return oSerializer.Serialize("1");
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateEventPic(string eventid, string baseval)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Events set Photo=@baseval where EventId=@eventid";
                    cmd.Parameters.AddWithValue("baseval", baseval);
                    cmd.Parameters.AddWithValue("eventid", eventid);
                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                    {
                        return oSerializer.Serialize("1");
                    }
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getEventPic(string eventid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            string baseval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                //try
                //{
                con.Open();
                cmd = new SqlCommand("", con);

                cmd.CommandText = "select Photo from TB_Events where EventId=@eventid";
                cmd.Parameters.AddWithValue("eventid", eventid);
                rdr = cmd.ExecuteReader();
                while (rdr.Read())
                    baseval = rdr["Photo"].ToString();
                rdr.Close();
                cmd.Parameters.Clear();
                con.Close();
                return oSerializer.Serialize(baseval);
                /*}
                catch (Exception ex)
                {
                    var json = JsonConvert.SerializeObject(stClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize("-1");// + ex.Message);
                }*/
            }
        }

        //Events Stories Code is Here
        [WebMethod(EnableSession = true)]
        public string addStories(string storytitle, string postedby, string description1, string description2, string description3, string photo)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {

                //try
                //{
                /* con.Open();
                 cmd = new SqlCommand("", con);
                 int res = 0;
                 cmd.CommandText = "select *from TB_Events where ";
                 cmd.Parameters.AddWithValue("mb", mobile);
                 rdr = cmd.ExecuteReader();
                 int exis = 0;
                 while (rdr.Read())
                 {
                     exis = 2;
                 }
                 rdr.Close();
                 cmd.Parameters.Clear();
                 if (exis == 2)
                 {
                     cmd.Parameters.Clear();
                     con.Close();
                     return oSerializer.Serialize("2");
                 }*/
                //  bgroup, string aadhar, string pan, string marital, string ifsc, string bankname, string micr, string bbranch, string bcontact, string bcity, string bdistrict, string bstate, string baddress                                                                                             
                try
                {
                    con.Open();
                    int res = 0;
                    cmd = new SqlCommand("", con);


                    cmd.CommandText = "insert into TB_Stories(Title,PostedOn,PostedBy,Description1,Description2,Description3,Photo,ShowOnSite) OUTPUT inserted.RowId values(@title,@postedon,@postedby,@description1,@description2,@description3,@photo,1)";
                    cmd.Parameters.AddWithValue("title", storytitle);
                    cmd.Parameters.AddWithValue("postedon", DateTime.Now);
                    cmd.Parameters.AddWithValue("postedby", postedby);
                    cmd.Parameters.AddWithValue("description1", description1);
                    cmd.Parameters.AddWithValue("description2", description2);
                    cmd.Parameters.AddWithValue("description3", description3);
                    cmd.Parameters.AddWithValue("photo", photo);
                    //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                    res = (int)cmd.ExecuteScalar();
                    cmd.Parameters.Clear();
                    string mid = "";
                    if (res <= 9)
                    {
                        mid = "Story0" + res.ToString();
                    }
                    else
                        mid = "Stories" + res.ToString();
                    cmd.CommandText = "update TB_Stories set StoryId=@mid where RowId=@rid";
                    cmd.Parameters.AddWithValue("mid", mid);
                    cmd.Parameters.AddWithValue("rid", res);
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    try
                    {
                        if (res > 0)
                        {
                            con.Close();
                            /*Session["uid"] = mid;
                            Session["cname"] = name + "." + sname;*/
                            return oSerializer.Serialize("1");
                        }
                        else
                        {
                            con.Close();
                            return oSerializer.Serialize("520");
                        }
                    }
                    catch (Exception ex)
                    {
                        return oSerializer.Serialize("-3" + ex.Message);
                    }

                }
                catch (Exception ex)
                {
                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        public class UserStoryClass
        {
            public string storyid { get; set; }
            public string title { get; set; }
            public string postedby { get; set; }
            public string postedon { get; set; }
            public string photo { get; set; }
            public string description1 { get; set; }
            public string description2 { get; set; }
            public string description3 { get; set; }
            public string showonsite { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string GetStory(string storyid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            UserStoryClass story;
            List<UserStoryClass> storieslist = new List<UserStoryClass>();



            using (con = new SqlConnection(constr))
            {
                //try
                //{
                con.Open();
                cmd = new SqlCommand("", con);
                cmd.CommandText = "select * from TB_Stories where StoryId=@storyid;";
                cmd.Parameters.AddWithValue("storyid", storyid);
                rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    story = new UserStoryClass();
                    story.storyid = rdr["StoryId"].ToString();
                    story.title = rdr["Title"].ToString();
                    story.postedby = rdr["PostedBy"].ToString();
                    story.postedon = Convert.ToDateTime(rdr["PostedOn"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                    story.photo = rdr["Photo"].ToString();
                    story.description1 = rdr["Description1"].ToString();
                    story.description2 = rdr["Description2"].ToString();
                    story.description3 = rdr["Description3"].ToString();
                    story.showonsite = rdr["ShowOnSite"].ToString();


                    storieslist.Add(story);
                }
                rdr.Close();
                cmd.Parameters.Clear();
                if (storieslist.Count > 0)
                {
                    int result = 0;

                    con.Close();
                    var json = JsonConvert.SerializeObject(storieslist);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
                else
                {
                    con.Close();
                    story = new UserStoryClass();
                    story.storyid = "521";
                    story.title = "";
                    storieslist.Add(story);
                    var json = JsonConvert.SerializeObject(storieslist);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
                /*}
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    uData = new UserDataClass();
                    uData.ustatus = "522";
                    uData.fname = ex.Message;   
                    uDataList.Add(uData);
                    var json = JsonConvert.SerializeObject(uDataList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }*/
            }
        }

        public class AllStoriesClass
        {
            public string storyid { get; set; }
            public string title { get; set; }
            public string postedon { get; set; }
            public string postedby { get; set; }
            public string photo { get; set; }
            public string description1 { get; set; }
            public string description3 { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string getAllStories()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            AllStoriesClass allStories;
            List<AllStoriesClass> allStoriesList = new List<AllStoriesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Stories order by PostedOn desc";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        allStories = new AllStoriesClass();
                        allStories.storyid = rdr["StoryId"].ToString();
                        allStories.title = rdr["Title"].ToString();
                        allStories.postedby = rdr["PostedBy"].ToString();
                        allStories.photo = rdr["Photo"].ToString();
                        allStories.postedon = Convert.ToDateTime(rdr["PostedOn"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        allStories.description1 = rdr["Description1"].ToString();
                        allStories.description3 = rdr["Description3"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        allStoriesList.Add(allStories);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (allStoriesList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(allStoriesList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        allStories = new AllStoriesClass();
                        allStories.title = "521";
                        allStories.description1 = "";
                        allStoriesList.Add(allStories);
                        var json = JsonConvert.SerializeObject(allStoriesList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    allStories = new AllStoriesClass();
                    allStories.title = "522";
                    allStories.description1 = "";
                    allStoriesList.Add(allStories);
                    var json = JsonConvert.SerializeObject(allStoriesList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateStoriesData(string storyid, string storytitle, string postedby, string description1, string description2, string description3, string showonsite)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Stories set Title=@title, PostedBy=@postedby, Description1=@description1, Description2=@description2,Description3=@description3,ShowOnSite=@showonsite where StoryId=@storyid;";
                    cmd.Parameters.AddWithValue("storyid", storyid);
                    cmd.Parameters.AddWithValue("title", storytitle);
                    cmd.Parameters.AddWithValue("postedby", postedby);
                    cmd.Parameters.AddWithValue("description1", description1);
                    cmd.Parameters.AddWithValue("description2", description2);
                    cmd.Parameters.AddWithValue("description3", description3);
                    //cmd.Parameters.AddWithValue("photo", photo);
                    cmd.Parameters.AddWithValue("showonsite", showonsite);


                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                        return oSerializer.Serialize("1");
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateStoreisPic(string storyid, string baseval)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "update TB_Stories set Photo=@baseval where StoryId=@storyid";
                    cmd.Parameters.AddWithValue("baseval", baseval);
                    cmd.Parameters.AddWithValue("storyid", storyid);
                    int res = cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();
                    con.Close();
                    if (res > 0)
                    {
                        return oSerializer.Serialize("1");
                    }
                    else
                        return oSerializer.Serialize("0");
                }
                catch (Exception ex)
                {

                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getStoriesPic(string storyid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            string baseval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            using (con = new SqlConnection(constr))
            {
                //try
                //{
                con.Open();
                cmd = new SqlCommand("", con);

                cmd.CommandText = "select Photo from TB_Stories where StoryId=@storyid";
                cmd.Parameters.AddWithValue("storyid", storyid);
                rdr = cmd.ExecuteReader();
                while (rdr.Read())
                    baseval = rdr["Photo"].ToString();
                rdr.Close();
                cmd.Parameters.Clear();
                con.Close();
                return oSerializer.Serialize(baseval);
                /*}
                catch (Exception ex)
                {
                    var json = JsonConvert.SerializeObject(stClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize("-1");// + ex.Message);
                }*/
            }
        }

        //Donation functionalities Code is Here
        public class DonationsClass
        {
            public string donationid { get; set; }
            public string title{ get; set; }
            public string category{ get; set; }
            public string targetamount { get; set; }
            public string description { get; set; }
            public string photo{ get; set; }
            public string donationstatus { get; set; }
            public string donateamount { get; set; }
            public string expendLink { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string getDonations()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            DonationsClass donations;
            List<DonationsClass> donationList = new List<DonationsClass>();



            using (con = new SqlConnection(constr))
            {
               // try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    //cmd.CommandText = "SELECT * FROM (SELECT D.RowId, D.DonationId, D.Title, D.Category, D.TargetAmount, D.Description, D.Photo, D.DonationStatus, D.ExpenditureLink, COALESCE(SUM(DA.DonationAmount), 0) AS TotalDonationAmount, ROW_NUMBER() OVER (ORDER BY D.RowId) AS RowNum FROM TB_Donations D LEFT JOIN TB_DonationAmount DA ON D.DonationId = DA.DonationPurpose WHERE D.DonationStatus = '1' GROUP BY D.RowId, D.DonationId, D.Category, D.Title, D.Description, D.TargetAmount, D.Photo, D.DonationStatus, D.ExpenditureLink) AS RankedData;";
                    cmd.CommandText = "SELECT * FROM (SELECT D.RowId, D.DonationId, D.Title, D.Category, D.TargetAmount, D.Description, D.Photo, D.DonationStatus, D.ExpenditureLink, COALESCE(SUM(CASE WHEN DA.PaymentStatus != 2 THEN DA.DonationAmount ELSE 0 END), 0) AS TotalDonationAmount, ROW_NUMBER() OVER (ORDER BY D.RowId) AS RowNum FROM TB_Donations D LEFT JOIN TB_DonationAmount DA ON D.DonationId = DA.DonationPurpose WHERE D.DonationStatus = '1' GROUP BY D.RowId, D.DonationId, D.Category, D.Title, D.Description, D.TargetAmount, D.Photo, D.DonationStatus, D.ExpenditureLink) AS RankedData;";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        donations = new DonationsClass();
                        donations.donationid= rdr["DonationId"].ToString();
                        donations.title = rdr["Title"].ToString();
                        donations.category = rdr["Category"].ToString();
                        donations.photo = rdr["Photo"].ToString();
                        donations.targetamount = rdr["TargetAmount"].ToString();
                        donations.description= rdr["Description"].ToString();
                        donations.expendLink = rdr["ExpenditureLink"].ToString();
                        donations.donateamount = rdr["TotalDonationAmount"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        donationList.Add(donations);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (donationList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(donationList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        donations = new DonationsClass();
                        donations.title = "521";
                        donationList.Add(donations);
                        var json = JsonConvert.SerializeObject(donationList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
             /*   catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    donations = new DonationsClass();
                    donations.title = "522";
                    donations.description = "";
                    donationList.Add(donations);
                    var json = JsonConvert.SerializeObject(donationList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }*/
            }
        }

        [WebMethod(EnableSession = true)]
        public string addDonation(string donationtitle, string category, string targetamount, string description, string photo, string ExpendLink)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    int res = 0;
                    cmd = new SqlCommand("", con);

                    cmd.CommandText = "insert into TB_Donations(Title,Category,TargetAmount,Description,Photo,DonationStatus,ExpenditureLink) OUTPUT inserted.RowId values(@title,@category,@targetamount,@description,@photo,1,@expendLink)";
                    cmd.Parameters.AddWithValue("title", donationtitle);
                    cmd.Parameters.AddWithValue("category", category);
                    cmd.Parameters.AddWithValue("description", description);
                    cmd.Parameters.AddWithValue("targetamount", targetamount);
                    cmd.Parameters.AddWithValue("photo", photo);
                    cmd.Parameters.AddWithValue("expendLink", ExpendLink);

                    // Execute the insert command and get the RowId
                    res = (int)cmd.ExecuteScalar();
                    cmd.Parameters.Clear();

                    // If at least one row is affected, set the DonationId and return "1"
                    if (res > 0)
                    {
                        string mid = (res <= 9) ? "Donation0" + res.ToString() : "Donation" + res.ToString();
                        cmd.CommandText = "update TB_Donations set DonationId=@mid where RowId=@rid";
                        cmd.Parameters.AddWithValue("mid", mid);
                        cmd.Parameters.AddWithValue("rid", res);
                        cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                        con.Close();
                        return oSerializer.Serialize("1");
                    }
                    else
                    {
                        // If no row is affected, return error code "520"
                        con.Close();
                        return oSerializer.Serialize("520");
                    }
                }
                catch (Exception ex)
                {
                    // If any exception occurs during execution, return error code "2" with the exception message
                    return oSerializer.Serialize("2" + ex.Message);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string updateUserDataByUserSettings(string fname, string sname, string gender, string dob, string maritalstatus, string bgroup, string phno, string email, string city, string profession, string workingin, string lclass, string workingas, string bio, string instaurl, string fbookurl, string linkdnurl, string medinsuexp, string medinsupro, string expertin, string native, string hob2, string designation, string country_code)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            System.Web.Script.Serialization.JavaScriptSerializer oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            if (Session["userid"] != null)
            {
                using (SqlConnection con = new SqlConnection(constr))
                {
                   // try
                    {
                        con.Open();
                        using (SqlCommand cmd = new SqlCommand("", con))
                        {
                            cmd.CommandText = "UPDATE TB_Users SET Name=@fname, Surname=@sname, Gender=@gender, DOB=@dob, MaritalStatus=@maritalstatus, BloodGroup=@bgroup, Mobile=@phno, Email=@email, City=@city, Profession=@profession, WorkingIn=@workingin, JNVLastClass=@lclass, WorkingAs=@workingas, Biodata=@bio, UserUpdatedOn=@userupdatedon, InstaUrl=@instaurl, FbookUrl=@fbookurl, LinkdnUrl=@linkdnurl, MedicalInsuranceExpiry=@medinsuexp, MedicalInsuranceProvider=@medinsupro, ExpertIn=@expertin, NativePlace=@native, Hobbies2=@hob2, Designation=@desig, country_code=@country_code WHERE UserId=@uid;";

                            cmd.Parameters.AddWithValue("uid", Session["userid"].ToString());
                            cmd.Parameters.AddWithValue("userupdatedon", DateTime.Now);
                            cmd.Parameters.AddWithValue("fname", string.IsNullOrEmpty(fname) ? (object)DBNull.Value : (object)fname);
                            cmd.Parameters.AddWithValue("sname", string.IsNullOrEmpty(sname) ? (object)DBNull.Value : (object)sname);
                            cmd.Parameters.AddWithValue("gender", string.IsNullOrEmpty(gender) ? (object)DBNull.Value : (object)gender);
                            cmd.Parameters.AddWithValue("dob", string.IsNullOrEmpty(dob) ? (object)DBNull.Value : (object)dob);
                            cmd.Parameters.AddWithValue("maritalstatus", string.IsNullOrEmpty(maritalstatus) ? (object)DBNull.Value : (object)maritalstatus);
                            cmd.Parameters.AddWithValue("bgroup", string.IsNullOrEmpty(bgroup) ? (object)DBNull.Value : (object)bgroup);
                            cmd.Parameters.AddWithValue("phno", string.IsNullOrEmpty(phno) ? (object)DBNull.Value : (object)phno);
                            cmd.Parameters.AddWithValue("email", string.IsNullOrEmpty(email) ? (object)DBNull.Value : (object)email);
                            cmd.Parameters.AddWithValue("city", string.IsNullOrEmpty(city) ? (object)DBNull.Value : (object)city);
                            cmd.Parameters.AddWithValue("profession", string.IsNullOrEmpty(profession) ? (object)DBNull.Value : (object)profession);
                            cmd.Parameters.AddWithValue("workingin", string.IsNullOrEmpty(workingin) ? (object)DBNull.Value : (object)workingin);
                            cmd.Parameters.AddWithValue("lclass", string.IsNullOrEmpty(lclass) ? (object)DBNull.Value : (object)lclass);
                            cmd.Parameters.AddWithValue("workingas", string.IsNullOrEmpty(workingas) ? (object)DBNull.Value : (object)workingas);
                            cmd.Parameters.AddWithValue("bio", string.IsNullOrEmpty(bio) ? (object)DBNull.Value : (object)bio);
                            cmd.Parameters.AddWithValue("instaurl", string.IsNullOrEmpty(instaurl) ? (object)DBNull.Value : (object)instaurl);
                            cmd.Parameters.AddWithValue("fbookurl", string.IsNullOrEmpty(fbookurl) ? (object)DBNull.Value : (object)fbookurl);
                            cmd.Parameters.AddWithValue("linkdnurl", string.IsNullOrEmpty(linkdnurl) ? (object)DBNull.Value : (object)linkdnurl);
                            cmd.Parameters.AddWithValue("desig", string.IsNullOrEmpty(designation) ? (object)DBNull.Value : (object)designation);
                            cmd.Parameters.AddWithValue("medinsuexp", string.IsNullOrEmpty(medinsuexp) ? (object)DBNull.Value : (object)medinsuexp);
                            cmd.Parameters.AddWithValue("medinsupro", string.IsNullOrEmpty(medinsupro) ? (object)DBNull.Value : (object)medinsupro);
                            cmd.Parameters.AddWithValue("expertin", string.IsNullOrEmpty(expertin) ? (object)DBNull.Value : (object)expertin);
                            cmd.Parameters.AddWithValue("native", string.IsNullOrEmpty(native) ? (object)DBNull.Value : (object)native);
                            cmd.Parameters.AddWithValue("hob2", string.IsNullOrEmpty(hob2) ? (object)DBNull.Value : (object)hob2);
                            cmd.Parameters.AddWithValue("country_code", string.IsNullOrEmpty(country_code) ? (object)DBNull.Value : (object)country_code);

                            int res = cmd.ExecuteNonQuery();

                            if (res > 0)
                                return oSerializer.Serialize("1");
                            else
                                return oSerializer.Serialize("0");
                        }
                    }
                 /*   catch (Exception ex)
                    {
                        return oSerializer.Serialize("-1" + ex.Message);
                    }
                  */
                }
            }
            else
            {
                return oSerializer.Serialize("520");
            }
        }
        
        //get batchmates data here 
        public class BatchMatesClass
        {
            public string uid { get; set; }
            public string fname { get; set; }
            public string sname { get; set; }
            public string batchno { get; set; }
            public string ustatus { get; set; }
            public string uphno { get; set; }
            public string uemail { get; set; }
            public string photo { get; set; }
            public string workingas { get; set; }
            public string bio { get; set; }
            public string instaurl { get; set; }
            public string fbookurl { get; set; }
            public string linkdnurl { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string batchmates()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            BatchMatesClass batchClass;
            List<BatchMatesClass> batchClassList = new List<BatchMatesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where BatchNo=@batchno ORDER BY Surname ASC";
                    if (Session["batchno"] != null)
                    {
                        cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                    }

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        batchClass = new BatchMatesClass();
                        batchClass.uid = rdr["UserId"].ToString();
                        batchClass.fname = rdr["Name"].ToString();
                        batchClass.sname = rdr["SurName"].ToString();
                        batchClass.ustatus = rdr["UStatus"].ToString();
                        batchClass.uphno = rdr["Mobile"].ToString();
                        batchClass.uemail = rdr["Email"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.instaurl = rdr["InstaUrl"].ToString();
                        batchClass.fbookurl = rdr["FbookUrl"].ToString();
                        batchClass.linkdnurl = rdr["LinkdnUrl"].ToString();

                        batchClassList.Add(batchClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (batchClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        batchClass = new BatchMatesClass();
                        batchClass.ustatus = "521";
                        batchClass.fname = "";
                        batchClassList.Add(batchClass);
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    batchClass = new BatchMatesClass();
                    batchClass.ustatus = "522";
                    batchClassList.Add(batchClass);
                    var json = JsonConvert.SerializeObject(batchClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getBatchmemeber(string batchno)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            BatchMatesClass batchClass;
            List<BatchMatesClass> batchClassList = new List<BatchMatesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where BatchNo=@batchno ORDER BY Surname ASC";
                    cmd.Parameters.AddWithValue("batchno", batchno);

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        batchClass = new BatchMatesClass();
                        batchClass.uid = rdr["UserId"].ToString();
                        batchClass.fname = rdr["Name"].ToString();
                        batchClass.sname = rdr["SurName"].ToString();
                        batchClass.ustatus = rdr["UStatus"].ToString();
                        batchClass.uphno = rdr["Mobile"].ToString();
                        batchClass.uemail = rdr["Email"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.instaurl = rdr["InstaUrl"].ToString();
                        batchClass.fbookurl = rdr["FbookUrl"].ToString();
                        batchClass.linkdnurl = rdr["LinkdnUrl"].ToString();

                        batchClassList.Add(batchClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (batchClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        batchClass = new BatchMatesClass();
                        batchClass.ustatus = "521";
                        batchClass.fname = "No Records found";
                        batchClassList.Add(batchClass);
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    batchClass = new BatchMatesClass();
                    batchClass.ustatus = "522";
                    batchClassList.Add(batchClass);
                    var json = JsonConvert.SerializeObject(batchClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }


        public class ProfessionClass
        {
            public string profession { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string getProfessions()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            ProfessionClass professionClass;
            List<ProfessionClass> professionList = new List<ProfessionClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT DISTINCT Profession FROM TB_Users WHERE Profession IS NOT NULL";

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        professionClass = new ProfessionClass();
                        professionClass.profession = rdr["Profession"].ToString();


                        professionList.Add(professionClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (professionList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(professionList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        professionClass = new ProfessionClass();
                        professionClass.profession = "521";
                        professionList.Add(professionClass);
                        var json = JsonConvert.SerializeObject(professionList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    professionClass = new ProfessionClass();
                    professionClass.profession = "522";
                    professionList.Add(professionClass);
                    var json = JsonConvert.SerializeObject(professionList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        public class DesignationClass
        {
            public string designation { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string getDesignations()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            DesignationClass designationClass;
            List<DesignationClass> designationList = new List<DesignationClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT DISTINCT Designation FROM TB_Users WHERE Designation IS NOT NULL";

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        designationClass = new DesignationClass();
                        designationClass.designation = rdr["Designation"].ToString();


                        designationList.Add(designationClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (designationList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(designationList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        designationClass = new DesignationClass();
                        designationClass.designation = "521";
                        designationList.Add(designationClass);
                        var json = JsonConvert.SerializeObject(designationList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    designationClass = new DesignationClass();
                    designationClass.designation = "522";
                    designationList.Add(designationClass);
                    var json = JsonConvert.SerializeObject(designationList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

      
        public class BatchNoClass
        {
            public string batchno { get; set; }

        }

        [WebMethod(EnableSession = true)]
        public string batchnumber()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            BatchNoClass batchClass;
            List<BatchNoClass> batchNoList = new List<BatchNoClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select distinct(BatchNo) as BatchNo from TB_Users ";

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        batchClass = new BatchNoClass();
                        batchClass.batchno = rdr["BatchNo"].ToString();


                        batchNoList.Add(batchClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (batchNoList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(batchNoList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        batchClass = new BatchNoClass();
                        batchClass.batchno = "521";
                        batchNoList.Add(batchClass);
                        var json = JsonConvert.SerializeObject(batchNoList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    batchClass = new BatchNoClass();
                    batchClass.batchno = "522";
                    batchNoList.Add(batchClass);
                    var json = JsonConvert.SerializeObject(batchNoList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string addFolderName(string foldername)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {


                con.Open();
                cmd = new SqlCommand("", con);
                int res = 0;
                cmd.CommandText = "select *from TB_GalleryFolders where FolderName=@foldername";
                cmd.Parameters.AddWithValue("foldername", foldername);
                rdr = cmd.ExecuteReader();
                int exis = 0;
                while (rdr.Read())
                {
                    exis = 2;
                }
                rdr.Close();
                cmd.Parameters.Clear();
                if (exis == 2)
                {
                    cmd.Parameters.Clear();
                    con.Close();
                    return oSerializer.Serialize("2");
                }
                else
                {
                    try
                    {
                        //con.open();
                        //int res = 0;
                        cmd = new SqlCommand("", con);


                        cmd.CommandText = "insert into TB_GalleryFolders(CreatedOn,FolderName,LastUpdatedOn) OUTPUT inserted.RowId values(@createdon,@foldername,@lastupdate)";
                        cmd.Parameters.AddWithValue("foldername", foldername);
                        cmd.Parameters.AddWithValue("createdon", DateTime.Now);
                        cmd.Parameters.AddWithValue("lastupdate", DateTime.Now);


                        //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                        res = (int)cmd.ExecuteScalar();
                        cmd.Parameters.Clear();
                        string mid = "";
                        if (res <= 9)
                        {
                            mid = "Folder0" + res.ToString();
                        }
                        else
                            mid = "Folder" + res.ToString();
                        cmd.CommandText = "update TB_GalleryFolders set FolderId=@mid where RowId=@rid";
                        cmd.Parameters.AddWithValue("mid", mid);
                        cmd.Parameters.AddWithValue("rid", res);
                        cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                        try
                        {
                            if (res > 0)
                            {
                                con.Close();
                                /*Session["uid"] = mid;
                                Session["cname"] = name + "." + sname;*/
                                return oSerializer.Serialize("1");
                            }
                            else
                            {
                                con.Close();
                                return oSerializer.Serialize("520");
                            }
                        }
                        catch (Exception ex)
                        {
                            return oSerializer.Serialize("-3" + ex.Message);
                        }

                    }
                    catch (Exception ex)
                    {
                        return oSerializer.Serialize("-1" + ex.Message);
                    }
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string addGalleryImage(string folderid, string photo)
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            using (con = new SqlConnection(constr))
            {

                try
                {
                    con.Open();
                    int res = 0;
                    cmd = new SqlCommand("", con);


                    cmd.CommandText = "insert into TB_GalleryImages(FolderId,Photo,UploadedOn) OUTPUT inserted.RowId values(@folderid,@photo,@uploadedon)";
                    cmd.Parameters.AddWithValue("folderid", folderid);
                    cmd.Parameters.AddWithValue("photo", photo);
                    cmd.Parameters.AddWithValue("uploadedon", DateTime.Now);


                    //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                    res = (int)cmd.ExecuteScalar();
                    cmd.Parameters.Clear();
                    string mid = "";
                    if (res <= 9)
                    {
                        mid = "Image0" + res.ToString();
                    }
                    else
                        mid = "Image" + res.ToString();
                    cmd.CommandText = "update TB_GalleryImages set ImageId=@mid where RowId=@rid";
                    cmd.Parameters.AddWithValue("mid", mid);
                    cmd.Parameters.AddWithValue("rid", res);
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();

                    cmd.CommandText = "update TB_GalleryFolders set LastUpdatedOn=@dt where FolderId=@fid";
                        cmd.Parameters.AddWithValue("dt",DateTime.Now);
                    cmd.Parameters.AddWithValue("fid",folderid);
                    cmd.ExecuteNonQuery();
                    cmd.Parameters.Clear();

                    try
                    {
                        if (res > 0)
                        {
                            con.Close();
                            /*Session["uid"] = mid;
                            Session["cname"] = name + "." + sname;*/
                            return oSerializer.Serialize("1");
                        }
                        else
                        {
                            con.Close();
                            return oSerializer.Serialize("520");
                        }
                    }
                    catch (Exception ex)
                    {
                        return oSerializer.Serialize("-3" + ex.Message);
                    }

                }
                catch (Exception ex)
                {
                    return oSerializer.Serialize("-1" + ex.Message);
                }
            }
        }


        public class GalleryImageClass
        {

            public string photo { get; set; }
            public string imgId { get; set; }


        }

        [WebMethod(EnableSession = true)]
        public string showGalleryImages(string folderid)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            GalleryImageClass galleryClass;
            List<GalleryImageClass> galleryList = new List<GalleryImageClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_GalleryImages where FolderId=@folderid";
                    cmd.Parameters.AddWithValue("folderid", folderid);

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        galleryClass = new GalleryImageClass();
                        galleryClass.photo = rdr["Photo"].ToString();
                        galleryClass.imgId = rdr["ImageId"].ToString();
                       

                        galleryList.Add(galleryClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (galleryList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(galleryList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        galleryClass = new GalleryImageClass();
                        galleryClass.photo = "521";
                        galleryList.Add(galleryClass);
                        var json = JsonConvert.SerializeObject(galleryList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    galleryClass = new GalleryImageClass();
                    galleryClass.photo = "522";
                    galleryList.Add(galleryClass);
                    var json = JsonConvert.SerializeObject(galleryList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        public class galleryManagementClass
        {
            public string createdon { get; set; }
            public string folderid { get; set; }
            public string foldername { get; set; }
            public string lastupdate { get; set; }
            public string countImage { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string galleryManagement()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            galleryManagementClass galleryManage;
            List<galleryManagementClass> galleryManageList = new List<galleryManagementClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    //cmd.CommandText = "select f.CreatedOn,f.FolderName,f.FolderId,f.LastUpdatedOn,count(i.Photo) as Cnt from TB_GalleryFolders f, TB_GalleryImages i where i.FolderId=f.FolderId group by f.FolderName,f.FolderId,f.CreatedOn,f.LastUpdatedOn";
                    cmd.CommandText = "SELECT f.CreatedOn,f.FolderName,f.FolderId,f.LastUpdatedOn,COALESCE(COUNT(i.Photo), 0) AS Cnt FROM TB_GalleryFolders f LEFT JOIN TB_GalleryImages i ON i.FolderId = f.FolderId GROUP BY f.FolderName, f.FolderId, f.CreatedOn, f.LastUpdatedOn;";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        galleryManage = new galleryManagementClass();
                        galleryManage.createdon = Convert.ToDateTime(rdr["CreatedOn"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        galleryManage.foldername = rdr["FolderName"].ToString();
                        galleryManage.folderid = rdr["FolderId"].ToString();
                        galleryManage.lastupdate = Convert.ToDateTime(rdr["LastUpdatedOn"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        galleryManage.countImage = rdr["Cnt"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        galleryManageList.Add(galleryManage);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (galleryManageList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(galleryManageList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        galleryManage = new galleryManagementClass();
                        galleryManage.foldername = "521";
                        galleryManageList.Add(galleryManage);
                        var json = JsonConvert.SerializeObject(galleryManageList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    galleryManage = new galleryManagementClass();
                    galleryManage.foldername = "522";
                    galleryManageList.Add(galleryManage);
                    var json = JsonConvert.SerializeObject(galleryManageList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string  signOut()
        {
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();


                Session.Clear();
                Session["userid"] = null;
                Session["desig"] = null;
                Session.Abandon();
                return oSerializer.Serialize("1");
        }

        public class FolderClass
        {
            public string folderid { get; set; }
            public string foldername { get; set; }


        }

        [WebMethod(EnableSession = true)]
        public string getFolderNameClass()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            FolderClass folderClass;
            List<FolderClass> foldernameList= new List<FolderClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_GalleryFolders";

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        folderClass = new FolderClass();
                        folderClass.folderid = rdr["FolderId"].ToString();
                        folderClass.foldername = rdr["FolderName"].ToString();
                        

                        foldernameList.Add(folderClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (foldernameList.Count > 0)
                    {
                        

                        con.Close();
                        var json = JsonConvert.SerializeObject(foldernameList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        folderClass = new FolderClass();
                        folderClass.folderid = "521";
                        folderClass.foldername = "";
                        foldernameList.Add(folderClass);
                        var json = JsonConvert.SerializeObject(foldernameList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    folderClass = new FolderClass();
                    folderClass.folderid = "522";
                    foldernameList.Add(folderClass);
                    var json = JsonConvert.SerializeObject(foldernameList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getallStory(string storyStatus)
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            AllStoriesClass allStories;
            List<AllStoriesClass> allStoriesList = new List<AllStoriesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Stories where ShowOnSite=@storyStatus";
                    cmd.Parameters.AddWithValue("storyStatus", storyStatus);
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        allStories = new AllStoriesClass();
                        allStories.storyid = rdr["StoryId"].ToString();
                        allStories.title = rdr["Title"].ToString();
                        allStories.postedby = rdr["PostedBy"].ToString();
                        allStories.photo = rdr["Photo"].ToString();
                        allStories.postedon = Convert.ToDateTime(rdr["PostedOn"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                        allStories.description1 = rdr["Description1"].ToString();

                        /* Session["userid"] = rdr["UserId"].ToString();
                         Session["uname"] = rdr["Name"].ToString()[0] + ". " + rdr["SurName"].ToString();
                         Session["batchno"] = rdr["BatchNo"].ToString();*/
                        allStoriesList.Add(allStories);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (allStoriesList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(allStoriesList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        allStories = new AllStoriesClass();
                        allStories.title = "521";
                        allStories.description1 = "";
                        allStoriesList.Add(allStories);
                        var json = JsonConvert.SerializeObject(allStoriesList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    allStories = new AllStoriesClass();
                    allStories.title = "522";
                    allStories.description1 = "";
                    allStoriesList.Add(allStories);
                    var json = JsonConvert.SerializeObject(allStoriesList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        public class getCountClass
        {
            public string approved { get; set; }
            public string pending { get; set; }
            public string blocked { get; set; }
            public string count { get; set; }
           public string spam { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string getCountofUser()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            getCountClass getCount;
            List<getCountClass> getCountList = new List<getCountClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT SUM(CASE WHEN UStatus = '1' THEN 1 ELSE 0 END) AS Approved, SUM(CASE WHEN UStatus IN ('-1', '-2') THEN 1 ELSE 0 END) AS Pending, SUM(CASE WHEN UStatus = '0' THEN 1 ELSE 0 END) AS Blocked,COUNT(*) as allUser FROM TB_Users;";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        getCount = new getCountClass();
                        getCount.approved = rdr["Approved"].ToString();
                        getCount.pending = rdr["Pending"].ToString();
                        getCount.blocked = rdr["Blocked"].ToString();
                        getCount.count = rdr["allUser"].ToString();
                        getCountList.Add(getCount);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (getCountList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        getCount = new getCountClass();
                        getCount.count = "521";

                        getCountList.Add(getCount);
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    getCount = new getCountClass();
                    getCount.count = "522";

                    getCountList.Add(getCount);
                    var json = JsonConvert.SerializeObject(getCountList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }


        [WebMethod(EnableSession = true)]
        public string getCountofBatchUser()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            getCountClass getCount;
            List<getCountClass> getCountList = new List<getCountClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT SUM(CASE WHEN UStatus = '1' THEN 1 ELSE 0 END) AS Approved, SUM(CASE WHEN UStatus IN ('-1', '-2') THEN 1 ELSE 0 END) AS Pending, SUM(CASE WHEN UStatus = '0' THEN 1 ELSE 0 END) AS Blocked,COUNT(*) as allUser FROM TB_Users WHERE BatchNo=@batchno";
                    cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        getCount = new getCountClass();
                        getCount.approved = rdr["Approved"].ToString();
                        getCount.pending = rdr["Pending"].ToString();
                        getCount.blocked = rdr["Blocked"].ToString();
                        getCount.count = rdr["allUser"].ToString();
                        getCountList.Add(getCount);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (getCountList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        getCount = new getCountClass();
                        getCount.count = "521";

                        getCountList.Add(getCount);
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    getCount = new getCountClass();
                    getCount.count = "522";

                    getCountList.Add(getCount);
                    var json = JsonConvert.SerializeObject(getCountList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string getCountofStories()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            getCountClass getCount;
            List<getCountClass> getCountList = new List<getCountClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT SUM(CASE WHEN ShowOnSite = '1' THEN 1 ELSE 0 END) AS Show,  SUM(CASE WHEN ShowOnSite = '-1' THEN 1 ELSE 0 END) AS Hide, SUM(CASE WHEN ShowOnSite = '-2' THEN 1 ELSE 0 END) AS Spam, COUNT(*) as allStories FROM   TB_Stories; ";
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        getCount = new getCountClass();
                        getCount.approved = rdr["Show"].ToString();
                        getCount.blocked = rdr["Hide"].ToString();
                       getCount.spam = rdr["Spam"].ToString();
                        getCount.count = rdr["allStories"].ToString();
                        getCountList.Add(getCount);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (getCountList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        getCount = new getCountClass();
                        getCount.count = "521";

                        getCountList.Add(getCount);
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    getCount = new getCountClass();
                    getCount.count = "522";

                    getCountList.Add(getCount);
                    var json = JsonConvert.SerializeObject(getCountList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

        public class EventCount{
            public string count { set; get; }
            public string Cancelled { set; get; }
            public string UpComingEvent { set; get; }
            public string Completed { set; get; }

            }

        [WebMethod(EnableSession = true)]
        public string getCountofEvents()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            EventCount getEventCount;
            List<EventCount> getCountList = new List<EventCount>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT COUNT(*) AS TotalEventsCount, SUM(CASE WHEN Datee > '2023/12/23' THEN 1 ELSE 0 END) AS UpcomingEventsCount, SUM(CASE WHEN Datee <= '2023/12/23' THEN 1 ELSE 0 END) AS CompletedEventsCount, SUM(CASE WHEN EventStatus = 2 THEN 1 ELSE 0 END) AS CancelledEventsCount FROM TB_Events;";
                    cmd.Parameters.AddWithValue("date", DateTime.Now);
                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        getEventCount = new EventCount();
                        getEventCount.UpComingEvent = rdr["UpcomingEventsCount"].ToString();
                        getEventCount.Completed = rdr["CompletedEventsCount"].ToString();
                        getEventCount.count = rdr["TotalEventsCount"].ToString();
                        getEventCount.Cancelled = rdr["CancelledEventsCount"].ToString();
                        getCountList.Add(getEventCount);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (getCountList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        getEventCount = new EventCount();
                        getEventCount.count = "521";

                        getCountList.Add(getEventCount);
                        var json = JsonConvert.SerializeObject(getCountList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    getEventCount = new EventCount();
                    getEventCount.count = "522";

                    getCountList.Add(getEventCount);
                    var json = JsonConvert.SerializeObject(getCountList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }


        [WebMethod(EnableSession = true)]
        public string getPresident()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            BatchMatesClass batchClass;
            List<BatchMatesClass> batchClassList = new List<BatchMatesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "select * from TB_Users where workingas ='2' order by workingas;";
                    if (Session["batchno"] != null)
                    {
                        cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                    }

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        batchClass = new BatchMatesClass();
                        batchClass.uid = rdr["UserId"].ToString();
                        batchClass.fname = rdr["Name"].ToString();
                        batchClass.sname = rdr["SurName"].ToString();
                        batchClass.ustatus = rdr["UStatus"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.bio = rdr["Biodata"].ToString();
                        batchClass.instaurl = rdr["InstaUrl"].ToString();
                        batchClass.fbookurl = rdr["FbookUrl"].ToString();
                        batchClass.linkdnurl = rdr["LinkdnUrl"].ToString();

                        batchClassList.Add(batchClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (batchClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        batchClass = new BatchMatesClass();
                        batchClass.ustatus = "521";
                        batchClass.fname = "";
                        batchClassList.Add(batchClass);
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    batchClass = new BatchMatesClass();
                    batchClass.ustatus = "522";
                    batchClassList.Add(batchClass);
                    var json = JsonConvert.SerializeObject(batchClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

         [WebMethod(EnableSession = true)]
        public string boardMembers()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            //string val = "0";
            string retval = "";
            System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            BatchMatesClass batchClass;
            List<BatchMatesClass> batchClassList = new List<BatchMatesClass>();



            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT * FROM TB_Users WHERE TRY_CAST(WorkingAs AS DECIMAL(10, 2)) > 2 ORDER BY WorkingAs;";
                    if (Session["batchno"] != null)
                    {
                        cmd.Parameters.AddWithValue("@batchno", Session["batchno"].ToString());
                    }

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        batchClass = new BatchMatesClass();
                        batchClass.uid = rdr["UserId"].ToString();
                        batchClass.fname = rdr["Name"].ToString();
                        batchClass.sname = rdr["SurName"].ToString();
                        batchClass.ustatus = rdr["UStatus"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.photo = rdr["Photo"].ToString();
                        batchClass.bio = rdr["Biodata"].ToString();
                        batchClass.workingas = rdr["WorkingAs"].ToString();
                        batchClass.instaurl = rdr["InstaUrl"].ToString();
                        batchClass.fbookurl = rdr["FbookUrl"].ToString();
                        batchClass.linkdnurl = rdr["LinkdnUrl"].ToString();

                        batchClassList.Add(batchClass);
                    }
                    rdr.Close();
                    cmd.Parameters.Clear();
                    if (batchClassList.Count > 0)
                    {
                        int result = 0;

                        con.Close();
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        batchClass = new BatchMatesClass();
                        batchClass.ustatus = "521";
                        batchClass.fname = "";
                        batchClassList.Add(batchClass);
                        var json = JsonConvert.SerializeObject(batchClassList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    batchClass = new BatchMatesClass();
                    batchClass.ustatus = "522";
                    batchClassList.Add(batchClass);
                    var json = JsonConvert.SerializeObject(batchClassList);
                    retval = json.ToString();
                    return oSerializer.Serialize(retval);
                }
            }
        }

   //contact page data will be here 
         [WebMethod(EnableSession = true)]
         public string addMessage(string uname, string uphno, string sub, string message)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

              try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "insert into TB_ContactMessages(Datee,FullName,PhoneNo,Subject,Msg,SeenStatus) OUTPUT inserted.RowId values(@datee,@fullname,@phno,@sub,@msg,-1)";
                     cmd.Parameters.AddWithValue("datee", DateTime.Now);
                     cmd.Parameters.AddWithValue("fullname", uname);
                     cmd.Parameters.AddWithValue("@phno", uphno);
                     cmd.Parameters.AddWithValue("@sub", sub);
                     cmd.Parameters.AddWithValue("@msg", message);
                     //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                     res = (int)cmd.ExecuteScalar();
                     cmd.Parameters.Clear();
                     string mid = "";
                     if (res <= 9)
                     {
                         mid = "Msg0" + res.ToString();
                     }
                     else
                         mid = "Msg" + res.ToString();
                     cmd.CommandText = "update TB_ContactMessages set MsgId=@mid where RowId=@rid";
                     cmd.Parameters.AddWithValue("mid", mid);
                     cmd.Parameters.AddWithValue("rid", res);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     try
                     {
                         if (res > 0)
                         {
                             con.Close();
                             /*Session["uid"] = mid;
                             Session["cname"] = name + "." + sname;*/
                             return oSerializer.Serialize("1");
                         }
                         else
                         {
                             con.Close();
                             return oSerializer.Serialize("520");
                         }
                     }
                     catch (Exception ex)
                     {
                         return oSerializer.Serialize("-3" + ex.Message);
                     }

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         public class UserMessageClass
         {
             public string msgid { get; set; }
             public string uname { get; set; }
             public string date { get; set; }
             public string uphno { get; set; }
             public string sub { get; set; }
             public string msg { get; set; }
             public string msgstatus { get; set; }

         }

        [WebMethod(EnableSession = true)]
         public string GetMessages(string seenstatus)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             UserMessageClass Message;
             List<UserMessageClass> msgList = new List<UserMessageClass>();

             
             using (con = new SqlConnection(constr))
             {
                 con.Open();

                 
                     cmd = new SqlCommand("", con);

                 if( (Convert.ToInt32(seenstatus))==0 ){
                     
                     cmd.CommandText = "select * from TB_ContactMessages ;";
                 }else{                     
                         cmd.CommandText = "select * from TB_ContactMessages where SeenStatus=@seenstatus";
                         cmd.Parameters.AddWithValue("seenstatus", seenstatus);
                 }
                 
                 rdr = cmd.ExecuteReader();
                 while (rdr.Read())
                 {
                     Message = new UserMessageClass();
                     Message.msgid= rdr["MsgId"].ToString();
                     Message.uname = rdr["FullName"].ToString();
                     Message.date = Convert.ToDateTime(rdr["Datee"].ToString()).ToString("yyyy-MM-dd").Replace(" 12:00:00 AM", "");
                     Message.uphno = rdr["PhoneNo"].ToString();
                     Message.sub = rdr["Subject"].ToString();
                     if (rdr["SeenStatus"].ToString().Equals("-1"))
                     {
                         Message.msgstatus = "Mark As Seen"; 
                     }
                     else Message.msgstatus = "Seen"; 
 

                     Message.msg = rdr["Msg"].ToString();


                     msgList.Add(Message);
                 }
                 rdr.Close();
                 cmd.Parameters.Clear();
                 if (msgList.Count > 0)
                 {
                     int result = 0;

                     con.Close();
                     var json = JsonConvert.SerializeObject(msgList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
                 else
                 {
                     con.Close();
                     Message = new UserMessageClass();
                     Message.msgid = "521";
                     msgList.Add(Message);
                     var json = JsonConvert.SerializeObject(msgList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
                 /*}
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     uData = new UserDataClass();
                     uData.ustatus = "522";
                     uData.fname = ex.Message;   
                     uDataList.Add(uData);
                     var json = JsonConvert.SerializeObject(uDataList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }*/
             }
         }

         [WebMethod(EnableSession = true)]
         public string delMessage(string msgid)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_ContactMessages WHERE MsgId=@msgid;";
                     cmd.Parameters.AddWithValue("msgid", msgid);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     return oSerializer.Serialize("1");

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string updateMsgStatus(string msgid)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             
                 using (con = new SqlConnection(constr))
                 {
                     try
                     {
                         con.Open();
                         cmd = new SqlCommand("", con);

                         cmd.CommandText = "update TB_ContactMessages set  SeenStatus=1 where MsgId=@msgid";
                         cmd.Parameters.AddWithValue("msgid", msgid);
                         
                         int res = cmd.ExecuteNonQuery();
                         cmd.Parameters.Clear();
                         con.Close();
                         if (res > 0)
                             return oSerializer.Serialize("1");
                         else
                             return oSerializer.Serialize("0");
                     }
                     catch (Exception ex)
                     {

                         return oSerializer.Serialize("-1" + ex.Message);
                     }
                 }
             
         }

         [WebMethod(EnableSession = true)]
         public string DeleteEvent(string eventid)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_Events WHERE EventId=@eventId;";
                     cmd.Parameters.AddWithValue("eventId", eventid);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     return oSerializer.Serialize("1");

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string DeleteStory(string storyId)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_Stories WHERE StoryId=@storyId;";
                     cmd.Parameters.AddWithValue("storyId", storyId);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     return oSerializer.Serialize("1");

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string DeleteImage(string imageId)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_GalleryImages WHERE ImageId=@imageId;";
                     cmd.Parameters.AddWithValue("imageId", imageId);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     return oSerializer.Serialize("1");

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string DeleteGallerFolder(string FolderId)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_GalleryFolders WHERE FolderId=@folderId;";
                     cmd.Parameters.AddWithValue("folderId", FolderId);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();

                     cmd.CommandText = "DELETE FROM TB_GalleryImages WHERE FolderId=@folderId;";
                     cmd.Parameters.AddWithValue("folderId", FolderId);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     
                     return oSerializer.Serialize("1");

                 }
               catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string Donate(string name, string mobileNo, string email, string batchNo, string PaymentMode, string DonateAmount,string RefNo,string DonatePurpose,string PaymentSS)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "insert into TB_DonationAmount(Name,MobileNo,Email,BatchNo,PaymentMode,DonationAmount,ReferenceNumber,PaymentScreenshot,paymentStatus,datee,DonationPurpose,timee) OUTPUT inserted.RowId values(@name,@mobileNo,@email,@batchNo,@PayMode,@DAmount,@RefNo,@PaySs,0,@datee,@donatePurpose,@timee)";
                     cmd.Parameters.AddWithValue("name", name);
                     cmd.Parameters.AddWithValue("datee", DateTime.Now);

                     DateTime currentTime = DateTime.Now;
                     TimeSpan timeValue = new TimeSpan(currentTime.Hour, currentTime.Minute, 0);

                     cmd.Parameters.AddWithValue("timee", timeValue);
                     cmd.Parameters.AddWithValue("email", email);
                     cmd.Parameters.AddWithValue("mobileNo", mobileNo);
                     cmd.Parameters.AddWithValue("batchNo", batchNo);
                     cmd.Parameters.AddWithValue("PayMode", PaymentMode);
                     cmd.Parameters.AddWithValue("DAmount", DonateAmount);
                     cmd.Parameters.AddWithValue("RefNo", RefNo);
                     cmd.Parameters.AddWithValue("PaySs", PaymentSS);
                     cmd.Parameters.AddWithValue("donatePurpose", DonatePurpose);


                    // Configure SMTP client
                    SmtpClient client = new SmtpClient("smtp.gmail.com");
                    client.Port = 587;
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("jnvvkaa@gmail.com", "qeayxyyaoeytypvw");

                    // Create email message
                    MailMessage message = new MailMessage();
                    message.From = new MailAddress("jnvvkaa@gmail.com");
                    message.To.Add("cakprasen@gmail.com");
                    message.Subject = $"New Donation Received from Batch: {batchNo} - {name}";
                    message.Body = $"New Donation Received with the following details:\nName: {name}\nBatch Number: {batchNo}\nDonated Amount: {DonateAmount}\nPurpose Od Donation: {DonatePurpose}\nPayment Mode: {PaymentMode}\nMobile Number: {mobileNo}\nEmail: {email}";

                    // Send email
                    client.Send(message);

                    //, Qualification, DeptId, CurDesig, CurOrganization, Experience, TeachLevel
                    res = (int)cmd.ExecuteScalar();
                     cmd.Parameters.Clear();
                     string mid = "";
                     if (res <= 9)
                     {
                         mid = "D0" + res.ToString();
                     }
                     else
                         mid = "D" + res.ToString();
                     cmd.CommandText = "update TB_DonationAmount set DonateId=@mid where RowId=@rid";
                     cmd.Parameters.AddWithValue("mid", mid);
                     cmd.Parameters.AddWithValue("rid", res);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     try
                     {
                         if (res > 0)
                         {
                             con.Close();
                             /*Session["uid"] = mid;
                             Session["cname"] = name + "." + sname;*/
                             return oSerializer.Serialize("1");
                         }
                         else
                         {
                             con.Close();
                             return oSerializer.Serialize("520");
                         }
                     }
                     catch (Exception ex)
                     {
                         return oSerializer.Serialize("-3" + ex.Message);
                     }

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         public class AllDonationsPurpose
         {
             public string donationId { get; set; }
             public string title { get; set; }
             public string category { get; set; }
             public string targetAmount { get; set; }
             public string description { get; set; }
             public string donationStatus { get; set; }
             public string totalAmount { get; set; }
            
         }

         [WebMethod(EnableSession = true)]
         public string getDonationPurpose()
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             AllDonationsPurpose allDonations;
             List<AllDonationsPurpose> AllDonationsPurList = new List<AllDonationsPurpose>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     //cmd.CommandText = "SELECT D.RowId, D.*, D.ExpenditureLink, SUM(DA.DonationAmount) AS TotalDonationAmount FROM TB_Donations D JOIN TB_DonationAmount DA ON D.DonationId = DA.DonationPurpose GROUP BY  D.RowId, D.DonationId, D.Category, D.Title, D.Description, D.TargetAmount, D.Photo, D.DonationStatus, D.ExpenditureLink; ";
                     //cmd.CommandText = "SELECT D.RowId, D.*, D.ExpenditureLink, ISNULL(SUM(DA.DonationAmount), 0) AS TotalDonationAmount FROM TB_Donations D LEFT JOIN TB_DonationAmount DA ON D.DonationId = DA.DonationPurpose GROUP BY D.RowId, D.DonationId, D.Category, D.Title, D.Description, D.TargetAmount, D.Photo, D.DonationStatus, D.ExpenditureLink; ";
                     cmd.CommandText = "SELECT D.RowId, D.*, D.ExpenditureLink, ISNULL(SUM(CASE WHEN DA.PaymentStatus != 2 THEN DA.DonationAmount ELSE 0 END), 0) AS TotalDonationAmount FROM TB_Donations D LEFT JOIN TB_DonationAmount DA ON D.DonationId = DA.DonationPurpose GROUP BY D.RowId, D.DonationId, D.Category, D.Title, D.Description, D.TargetAmount, D.Photo, D.DonationStatus, D.ExpenditureLink; ";
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         allDonations = new AllDonationsPurpose();
                         allDonations.donationId = rdr["DonationId"].ToString();
                         allDonations.title = rdr["Title"].ToString();
                         allDonations.category = rdr["Category"].ToString();
                         allDonations.description = rdr["Description"].ToString();
                         allDonations.targetAmount = rdr["TargetAmount"].ToString();
                         allDonations.totalAmount = rdr["TotalDonationAmount"].ToString();

                         AllDonationsPurList.Add(allDonations);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (AllDonationsPurList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(AllDonationsPurList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         allDonations = new AllDonationsPurpose();
                         allDonations.title = "521";
                         allDonations.category = "";
                         AllDonationsPurList.Add(allDonations);
                         var json = JsonConvert.SerializeObject(AllDonationsPurList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     allDonations = new AllDonationsPurpose();
                     allDonations.title = "522";
                     allDonations.category = "";
                     AllDonationsPurList.Add(allDonations);
                     var json = JsonConvert.SerializeObject(AllDonationsPurList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

         public class AllDonations
         {
             public string donationId { get; set; }
             public string title { get; set; }
             public string category { get; set; }
             public string targetAmount { get; set; }
             public string description { get; set; }
             public string donationStatus { get; set; }
             public string totalAmount { get; set; }
             public string photo { get; set; }
         }

         [WebMethod(EnableSession = true)]
         public string getDonationDetails(string DonationId)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             AllDonations allDonations;
             List<AllDonations> AllDonationsList = new List<AllDonations>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "SELECT D.RowId, D.*, (SELECT SUM(DonationAmount) FROM TB_DonationAmount WHERE DonationPurpose = D.DonationId) AS TotalDonationAmount FROM TB_Donations D WHERE D.DonationId = @donationId;";
                     cmd.Parameters.AddWithValue("donationId", DonationId);
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         allDonations = new AllDonations();
                         allDonations.donationId = rdr["DonationId"].ToString();
                         allDonations.title = rdr["Title"].ToString();
                         allDonations.donationStatus = rdr["DonationStatus"].ToString();
                         allDonations.category = rdr["Category"].ToString();
                         allDonations.description = rdr["Description"].ToString();
                         allDonations.targetAmount = rdr["TargetAmount"].ToString();
                         allDonations.totalAmount = rdr["TotalDonationAmount"].ToString();
                         allDonations.photo = rdr["Photo"].ToString();

                         AllDonationsList.Add(allDonations);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (AllDonationsList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(AllDonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         allDonations = new AllDonations();
                         allDonations.title = "521";
                         allDonations.category = "";
                         AllDonationsList.Add(allDonations);
                         var json = JsonConvert.SerializeObject(AllDonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     allDonations = new AllDonations();
                     allDonations.title = "522";
                     allDonations.category = "";
                     AllDonationsList.Add(allDonations);
                     var json = JsonConvert.SerializeObject(AllDonationsList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

         public class DonationData
         {
             public string donationId { get; set; }
             public string name { get; set; }
             public string email { get; set; }
             public string mobileNo { get; set; }
             public string batchNo { get; set; }
             public string PaymentMode { get; set; }
             public string DonationAmount { get; set; }
             public string RefNo { get; set; }
             public string paymentSS { get; set; }
             public string payStatus { get; set; }
             public string payDate { get; set; }
             public string payPurpose { get; set; }
             public string payTime { get; set; }
             public string datee { get; set; }
             public string timee { get; set; }
         }

         [WebMethod(EnableSession = true)]
         public string getDonationList(string PurposeId)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             DonationData donateData;
             List<DonationData> DonationsList = new List<DonationData>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "select * from TB_DonationAmount where DonationPurpose=@donationId;";
                     cmd.Parameters.AddWithValue("donationId", PurposeId);
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         donateData = new DonationData();
                         donateData.donationId = rdr["DonateId"].ToString();
                         donateData.name = rdr["Name"].ToString();
                         donateData.email = rdr["Email"].ToString();
                         donateData.payPurpose = rdr["DonationPurpose"].ToString();
                         donateData.mobileNo = rdr["MobileNo"].ToString();
                         donateData.batchNo = rdr["BatchNo"].ToString();
                         donateData.PaymentMode = rdr["PaymentMode"].ToString();
                         donateData.DonationAmount = rdr["DonationAmount"].ToString();
                         donateData.RefNo = rdr["ReferenceNumber"].ToString();
                         donateData.paymentSS = rdr["PaymentScreenshot"].ToString();
                         donateData.payStatus = rdr["paymentStatus"].ToString();
                         donateData.DonationAmount = rdr["DonationAmount"].ToString();
                         donateData.datee = Convert.ToDateTime(rdr["datee"].ToString()).ToString("dd-MM-yyyy").Replace(" 12:00:00 AM", "");
                         donateData.payPurpose = rdr["DonationPurpose"].ToString();
                         donateData.timee = rdr["timee"].ToString();

                         DonationsList.Add(donateData);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (DonationsList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(DonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         donateData = new DonationData();
                         donateData.name = "521";
                         donateData.payPurpose = "";
                         DonationsList.Add(donateData);
                         var json = JsonConvert.SerializeObject(DonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     donateData = new DonationData();
                     donateData.name = "522";
                     donateData.payPurpose = "";
                     DonationsList.Add(donateData);
                     var json = JsonConvert.SerializeObject(DonationsList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

         public class UserDonation
         {
             public string DonatedValue { get; set; }
             public string ProcessValue { get; set; }
         }

        [WebMethod(EnableSession = true)]
         public string userDonated()
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string userEmail="";

             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             UserDonation Donations;
             List<UserDonation> DonationsAmount = new List<UserDonation>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {

                     if (Session["email"] != null)
                     {
                         userEmail = Session["email"].ToString();
                         // Now you can use userEmail as needed
                     }
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "SELECT ISNULL(SUM(CASE WHEN paymentStatus = '0' THEN DonationAmount ELSE 0 END), 0) AS DProcess, ISNULL(SUM(CASE WHEN paymentStatus = '1' THEN DonationAmount ELSE 0 END), 0) AS Donated FROM TB_DonationAmount WHERE Email = @email;";
                     cmd.Parameters.AddWithValue("email", userEmail);
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         Donations = new UserDonation();
                         Donations.DonatedValue = rdr["Donated"].ToString();
                         Donations.ProcessValue = rdr["DProcess"].ToString();
                         

                         DonationsAmount.Add(Donations);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (DonationsAmount.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(DonationsAmount);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         Donations = new UserDonation();
                         Donations.DonatedValue = "521";
                         Donations.ProcessValue = userEmail;
                         DonationsAmount.Add(Donations);
                         var json = JsonConvert.SerializeObject(DonationsAmount);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     Donations = new UserDonation();
                     Donations.DonatedValue = "522";
                     Donations.ProcessValue = userEmail;
                     DonationsAmount.Add(Donations);
                     var json = JsonConvert.SerializeObject(DonationsAmount);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }


         [WebMethod(EnableSession = true)]
         public string updatePayStatus(string payId, string PayStatus)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);

                     cmd.CommandText = "update TB_DonationAmount set paymentStatus=@payStatus where DonateId=@payId";
                     cmd.Parameters.AddWithValue("payStatus", PayStatus);
                     cmd.Parameters.AddWithValue("payId", payId);
                     int res = cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     con.Close();
                     if (res > 0)
                         return oSerializer.Serialize("1");
                     else
                         return oSerializer.Serialize("0");
                 }
                 catch (Exception ex)
                 {

                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string updatePassword(string userPass)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);

                     cmd.CommandText = "UPDATE TB_Users SET Pwd = @userPass WHERE UserId = @uid;";
                     cmd.Parameters.AddWithValue("uid", Session["userid"].ToString());
                     cmd.Parameters.AddWithValue("userPass", userPass);
                     int res = cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     con.Close();
                     if (res > 0)
                         return oSerializer.Serialize("1");
                     else
                         return oSerializer.Serialize("0");
                 }
                 catch (Exception ex)
                 {

                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string updateDonationPurposeStatus(string DonationPurposeId, string donateStatus)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);

                     cmd.CommandText = "UPDATE TB_Donations SET DonationStatus = @dStatus WHERE DonationId = @donationId;";
                     cmd.Parameters.AddWithValue("dStatus", donateStatus);
                     cmd.Parameters.AddWithValue("donationId", DonationPurposeId);
                     int res = cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     con.Close();
                     if (res > 0)
                         return oSerializer.Serialize("1");
                     else
                         return oSerializer.Serialize("0");
                 }
                 catch (Exception ex)
                 {

                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

        public class DonationAmountData
         {
             public string BatchId { get; set; }
             public string TotalDonationAmount { get; set; }
             
         }

         [WebMethod(EnableSession = true)]
         public string getDonationBatchData()
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             DonationAmountData BatchDonationData;
             List<DonationAmountData> BatchDonationList = new List<DonationAmountData>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "SELECT CASE WHEN BatchNo IS NULL THEN 'Others' ELSE BatchNo END AS Batch, SUM(CASE WHEN PaymentStatus = 1 THEN DonationAmount ELSE 0 END) AS TotalDonationAmount FROM [__JNVKAA].[dbo].[TB_DonationAmount] GROUP BY CASE WHEN BatchNo IS NULL THEN 'Others' ELSE BatchNo END;";
                     
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         BatchDonationData = new DonationAmountData();
                         BatchDonationData.BatchId = rdr["Batch"].ToString();
                         BatchDonationData.TotalDonationAmount = rdr["TotalDonationAmount"].ToString();

                         BatchDonationList.Add(BatchDonationData);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (BatchDonationList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(BatchDonationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         BatchDonationData = new DonationAmountData();
                         BatchDonationData.BatchId = "521";
                         BatchDonationData.TotalDonationAmount = "";
                         BatchDonationList.Add(BatchDonationData);
                         var json = JsonConvert.SerializeObject(BatchDonationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     BatchDonationData = new DonationAmountData();
                     BatchDonationData.BatchId = "522";
                     BatchDonationData.TotalDonationAmount = "";
                     BatchDonationList.Add(BatchDonationData);
                     var json = JsonConvert.SerializeObject(BatchDonationList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

        [WebMethod(EnableSession = true)]
         public string getDonationPurposeData()
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             DonationAmountData BatchDonationData;
             List<DonationAmountData> BatchDonationList = new List<DonationAmountData>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "SELECT d.Title AS DonationName, SUM(CASE WHEN DA.PaymentStatus = 1 THEN DA.DonationAmount ELSE 0 END) AS TotalDonationAmount FROM TB_DonationAmount da,TB_Donations d WHERE da.DonationPurpose = d.DonationId GROUP BY d.Title;";

                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         BatchDonationData = new DonationAmountData();
                         BatchDonationData.BatchId = rdr["DonationName"].ToString();
                         BatchDonationData.TotalDonationAmount = rdr["TotalDonationAmount"].ToString();

                         BatchDonationList.Add(BatchDonationData);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (BatchDonationList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(BatchDonationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         BatchDonationData = new DonationAmountData();
                         BatchDonationData.BatchId = "521";
                         BatchDonationData.TotalDonationAmount = "";
                         BatchDonationList.Add(BatchDonationData);
                         var json = JsonConvert.SerializeObject(BatchDonationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     BatchDonationData = new DonationAmountData();
                     BatchDonationData.BatchId = "522";
                     BatchDonationData.TotalDonationAmount = "";
                     BatchDonationList.Add(BatchDonationData);
                     var json = JsonConvert.SerializeObject(BatchDonationList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string getDonationPersonList()
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             DonationData donateData;
             List<DonationData> DonationsList = new List<DonationData>();



             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "SELECT TOP 100 * FROM TB_DonationAmount WHERE paymentStatus = 1 ORDER BY [datee] DESC;";
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         donateData = new DonationData();
                         donateData.donationId = rdr["DonateId"].ToString();
                         donateData.name = rdr["Name"].ToString();
                         donateData.email = rdr["Email"].ToString();
                         donateData.payPurpose = rdr["DonationPurpose"].ToString();
                         donateData.mobileNo = rdr["MobileNo"].ToString();
                         donateData.batchNo = rdr["BatchNo"].ToString();
                         donateData.PaymentMode = rdr["PaymentMode"].ToString();
                         donateData.DonationAmount = rdr["DonationAmount"].ToString();
                         donateData.RefNo = rdr["ReferenceNumber"].ToString();
                         donateData.paymentSS = rdr["PaymentScreenshot"].ToString();
                         donateData.payStatus = rdr["paymentStatus"].ToString();
                         donateData.DonationAmount = rdr["DonationAmount"].ToString();
                         donateData.datee = Convert.ToDateTime(rdr["datee"].ToString()).ToString("dd-MM-yyyy").Replace(" 12:00:00 AM", "");
                         donateData.payPurpose = rdr["DonationPurpose"].ToString();
                         donateData.timee = rdr["timee"].ToString();

                         DonationsList.Add(donateData);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (DonationsList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(DonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         donateData = new DonationData();
                         donateData.name = "521";
                         donateData.payPurpose = "";
                         DonationsList.Add(donateData);
                         var json = JsonConvert.SerializeObject(DonationsList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                 catch (Exception ex)
                 {
                     Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                     donateData = new DonationData();
                     donateData.name = "522";
                     donateData.payPurpose = "";
                     DonationsList.Add(donateData);
                     var json = JsonConvert.SerializeObject(DonationsList);
                     retval = json.ToString();
                     return oSerializer.Serialize(retval);
                 }
             }
         }

         [WebMethod(EnableSession = true)]
         public string getEditDonationData(string DonationId)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             string retval = "";
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             DonationsClass donations;
             List<DonationsClass> donationList = new List<DonationsClass>();



             using (con = new SqlConnection(constr))
             {
                  try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);
                     cmd.CommandText = "select * from TB_Donations where DonationID=@donationId";
                     cmd.Parameters.AddWithValue("@donationId", DonationId);
                     rdr = cmd.ExecuteReader();

                     while (rdr.Read())
                     {
                         donations = new DonationsClass();
                         donations.title = rdr["Title"].ToString();
                         donations.category = rdr["Category"].ToString();
                         donations.photo = rdr["Photo"].ToString();
                         donations.targetamount = rdr["TargetAmount"].ToString();
                         donations.description = rdr["Description"].ToString();
                         donations.expendLink = rdr["ExpenditureLink"].ToString();
                         donations.donationstatus = rdr["DonationStatus"].ToString();

                         donationList.Add(donations);
                     }
                     rdr.Close();
                     cmd.Parameters.Clear();
                     if (donationList.Count > 0)
                     {
                         int result = 0;

                         con.Close();
                         var json = JsonConvert.SerializeObject(donationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                     else
                     {
                         con.Close();
                         donations = new DonationsClass();
                         donations.title = "521";
                         donationList.Add(donations);
                         var json = JsonConvert.SerializeObject(donationList);
                         retval = json.ToString();
                         return oSerializer.Serialize(retval);
                     }
                 }
                   catch (Exception ex)
                    {
                        Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                        donations = new DonationsClass();
                        donations.title = "522";
                        donations.description = "";
                        donationList.Add(donations);
                        var json = JsonConvert.SerializeObject(donationList);
                        retval = json.ToString();
                        return oSerializer.Serialize(retval);
                    }
             }
         }

         [WebMethod(EnableSession = true)]
         public string updateDonationPurposeData(string donateId, string title, string category, string description, string targetAmount, string photo, string expendLink, string donateStatus)
         {
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();

             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();

             using (con = new SqlConnection(constr))
             {
                 try
                 {
                     con.Open();
                     cmd = new SqlCommand("", con);

                     cmd.CommandText = "update TB_Donations set Title=@title, Category=@category, TargetAmount=@targetAmount, Description=@description,Photo=@photo, DonationStatus=@donateStatus,ExpenditureLink=@expendLink where DonationId=@donateid;";
                     cmd.Parameters.AddWithValue("donateid", donateId);
                     cmd.Parameters.AddWithValue("title", title);
                     cmd.Parameters.AddWithValue("category", category);
                     cmd.Parameters.AddWithValue("targetAmount", targetAmount);
                     cmd.Parameters.AddWithValue("description", description);
                     cmd.Parameters.AddWithValue("photo", photo);
                     cmd.Parameters.AddWithValue("donateStatus", donateStatus);
                     cmd.Parameters.AddWithValue("expendLink", expendLink);
                     

                     int res = cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     con.Close();
                     if (res > 0)
                         return oSerializer.Serialize("1");
                     else
                         return oSerializer.Serialize("0");
                 }
                 catch (Exception ex)
                 {

                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

        [WebMethod(EnableSession = true)]
         public string delDonations(string donationId)
         {
             System.Web.Script.Serialization.JavaScriptSerializer serial = new System.Web.Script.Serialization.JavaScriptSerializer();
             var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
             string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
             //string val = "0";
             using (con = new SqlConnection(constr))
             {

                 try
                 {
                     con.Open();
                     int res = 0;
                     cmd = new SqlCommand("", con);


                     cmd.CommandText = "DELETE FROM TB_Donations WHERE DonationId=@donationId;";
                     cmd.Parameters.AddWithValue("donationId", donationId);
                     cmd.ExecuteNonQuery();
                     cmd.Parameters.Clear();
                     return oSerializer.Serialize("1");

                 }
                 catch (Exception ex)
                 {
                     return oSerializer.Serialize("-1" + ex.Message);
                 }
             }
         }

        public class BatchUserData
        {
            public string BatchId { get; set; }
            public int TotalUsers { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string getBatchUserData()
        {
            string constr = ConfigurationManager.ConnectionStrings["constr"].ToString();
            string retval = "";
            var batchUserDataList = new List<BatchUserData>();

            using (con = new SqlConnection(constr))
            {
                try
                {
                    con.Open();
                    cmd = new SqlCommand("", con);
                    cmd.CommandText = "SELECT CASE WHEN BatchNo IS NULL THEN 'Others' ELSE BatchNo END AS Batch, " +
                                      "SUM(CASE WHEN UStatus = 1 THEN 1 ELSE 0 END) AS TotalUsers " +
                                      "FROM [__JNVKAA].[dbo].[TB_Users] " +
                                      "GROUP BY CASE WHEN BatchNo IS NULL THEN 'Others' ELSE BatchNo END;";

                    rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        var batchUserData = new BatchUserData();
                        batchUserData.BatchId = rdr["Batch"].ToString();
                        batchUserData.TotalUsers = Convert.ToInt32(rdr["TotalUsers"]);
                        batchUserDataList.Add(batchUserData);
                    }

                    rdr.Close();

                    if (batchUserDataList.Count > 0)
                    {
                        con.Close();
                        var json = JsonConvert.SerializeObject(batchUserDataList);
                        retval = json.ToString();
                        return new JavaScriptSerializer().Serialize(retval);
                    }
                    else
                    {
                        con.Close();
                        var defaultData = new BatchUserData() { BatchId = "521", TotalUsers = 0 };
                        batchUserDataList.Add(defaultData);
                        var json = JsonConvert.SerializeObject(batchUserDataList);
                        retval = json.ToString();
                        return new JavaScriptSerializer().Serialize(retval);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("VIRTUAL: Ex: " + ex.Message);
                    var errorData = new BatchUserData() { BatchId = "522", TotalUsers = 0 };
                    batchUserDataList.Add(errorData);
                    var json = JsonConvert.SerializeObject(batchUserDataList);
                    retval = json.ToString();
                    return new JavaScriptSerializer().Serialize(retval);
                }
            }
        }

    }

}