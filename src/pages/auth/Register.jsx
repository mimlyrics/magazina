//  Register --- Check validation before submiting, Good-custom-design

import {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux"
import {Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation} from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye, FaCheck, FaCircle, FaSquare, FaX, FaInfo, FaExclamation } from "react-icons/fa6";
import axios from "../../api/axios";
const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const LASTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX =  /^[A-Za-z]\w{7,14}$/;  /*/^(?=.*[0-9]+.*)(?=.*[a-zA-z]+.*)[0-9a-zA-Z]{6,}$/;*/
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
import { PhoneInput } from 'react-international-phone';
import "react-international-phone/style.css";
import { USERS_URL, REGISTER_URL } from "../../routes/serverRoutes";
/*const FIRSTNAME_ERR_MSG = 
const LASTNAME_ERR_MSG = Last name. must start with a letter. No(~!@#$%^&*(_+){}\"'.,:;/?)
const EMAIL_ERR_MSG = invalid email. example: example@gmail.com 
const PASSWORD_ERR_MSG = password. atleast(one lowercase, uppercase letter, digit)
const MOBILENO_ERR_MSG = mobile number. must be 9 digits */
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [validMatch, setValidMatch] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSucess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const firstNameRef = useRef();
  const [firstNameFocus, setFirstNameFocus] = useState("");
  const [lastNameFocus, setLastNameFocus] = useState("");
  const [emailFocus, setEmailFocus] = useState("");
  const [phoneFocus, setPhoneFocus] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [passwordFocus, setPasswordFocus] = useState("");
  const errRef = useRef();


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo} = useSelector((state) => state.auth);
  const [register, {isLoading}] = useRegisterMutation();

  const [showEmail, setShowEmail] = useState(false);
  const [steps, setSteps] = useState([1,2,3,4])

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    //console.log(result);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    //console.log(result);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    //console.log(result);
    setValidEmail(result);
  }, [email]);


  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    //console.log(result);
    setValidPassword(result);
  }, [password]);

  const handleShowPassword = (e) => {
    e.preventDefault();
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(isChecked && validEmail && validFirstName && validLastName && validPassword) {
        //const res = await register({firstName, lastName, phone, email, password}).unwrap();
        console.log(lastName, password, email);
        const res = await axios.post(REGISTER_URL,  {firstname: firstName, lastname: lastName, phone, email, password: password},{headers: {"Content-Type": "application/json"}, withCredentials: true});
        dispatch(setCredentials({ ...res?.data }));
        console.log(res);
        setSucess(true);
        navigate("/");
      }
      else if(!isChecked) {
        console.log("terms of services must be checked");
        setErrMsg("Terms of services must be checked");
        setSucess(false);
      }
      else {
        setErrMsg("Make sure all fields are checked");
      }
    }catch(error) {
      console.log(error?.data?.message || error.error);
      setSucess(false);
      setErrMsg(error?.data?.message);
    }
  }

  /*return (
    <section className={ isActiveModalNavbar ? 
        " relative opacity-60 -z-50 text-gray-700 " : " -z-50 text-violet-950 "}>
      {errMsg ? 
        <div className=" animate transition ease-in-out duration-500 absolute -top-9 right-2 border-b-4 border-b-white-700 shadow font-semibold rounded text-center text-lg bg-blue-500 h-9 w-60 ">
          <p>Registration failed - {errMsg}</p>
        </div>
        : 
        null
      }
      <div className=" my-1 ">
        <form
          className=" py-6 bg-[rgba(255,255,255,0.7)] md:w-6/12 md:ml-64 md:py-9 mx-3 
            shadow-2xl shadow-indigo-400 rounded flex-col text-lg"
        >
          <h2 className="text-center font-medium mt-2 mb-3 italic text-2xl">
            Sign Up to Mimlyrics
          </h2>

          <p className=" my-2 text-center">
            Already have an account ?{" "}
            <Link to="/login" className="bg-purple-200 rounded">
              Login
            </Link>
          </p>

          <div className=" relative my-2 text-gray-700">
            <div className=" relative mx-[2%] py-5">
              {emailFocus? <label className="absolute z-50 -top-[1px] mx-8 px-8 ">Email*</label> : null}
              <input 
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="-z-50 border outline-violet-800 focus:outline-none rounded-md p-3 w-full hover:rounded-lg"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </div>

            <div className=" relative mx-[2%]">
              
              {passwordFocus ? 
                <label className=" absolute z-50 -top-[15px] mx-8 px-8  ">
                  Password*
                </label> : null
              }
              <input 
                type="text"
                placeholder="Enter your password..."
                value={password}
                onChange={e=>setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(focus)}
                className=" -z-50 border outline-violet-800 focus:outline-none rounded-md p-3 w-full hover:rounded-lg"
              />
            </div>
            <button onClick={getEmailCodeFunc} className=" mx-3 my-3 border rounded-md py-2 px-9 bg-violet-100 hover:bg-violet-200">Continue</button>            
          </div>

        </form>
      </div>
    </section>
  );*/


  return (
    <section className={   " relative " }>
    {errMsg ? 
      <div className=" animate transition ease-in-out duration-500 absolute -top-9 right-2 border-b-4 
      border-b-white-700 shadow font-semibold rounded text-center text-lg bg-slate-400 h-9 w-60 ">
        <p>Registration failed - {errMsg}</p>
      </div>
      : 
      null
    }
    <div className=" my-1 text-gray-950">
      <form
        className=" py-6 bg-slate-200 md:w-6/12 md:ml-64 md:py-9 mx-3 
          shadow-2xl shadow-slate-400 rounded flex-col text-lg"
        action="./register"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-medium mt-2 mb-3 italic text-2xl">
          Sign Up
        </h2>

        <p className=" my-2 text-center">
          Already have an account ?{" "}
          <Link to="/login" className="bg-purple-200 rounded">
            Login
          </Link>
        </p>

        <div className="flex justify-between">
          <div className="form-group p-2 ">
            <label className="flex" htmlFor="firstName">
              First Name 
              <span className={validFirstName ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validFirstName || !firstName ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
            </label>
            <input
              ref={firstNameRef}
              type="text"
              autoComplete="off"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              className=" px-2 border rounded w-full md:w-36 lg:w-52 mr-5 h-8 text-blue-600"
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            
            <p className={firstNameFocus && firstName && !validFirstName ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             First name. must start with a letter. 
             Letters, numbers
             No(~!@#$%^&*(_+){} \"'.,:;/?){" "}</p>
          </div>

          <div className=" p-2 ">
            <label className="flex" htmlFor="lastName">Last Name
              <span className={validLastName ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validLastName || (!lastName) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
            </label>
            <input
              type="text"
              autoComplete="off"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded mr-5 w-full md:w-48 lg:w-52  h-8 text-blue-600"
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
          </div>
           
            <div className="">
            <p className={lastNameFocus && lastName && !validLastName ? " shadow-blue-950 shadow-lg flex w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Last name. must start with a letter. 
             Letters, numbers
             No(~!@#$%^&*(_+){} \"'.,:;/?){" "}</p></div>
        </div>

        <div className="form-group p-2">
          <label className="flex" htmlFor="email">Email
              <span className={validEmail ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validEmail || (!email) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-blue-600"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
          />
            
            <p className={emailFocus && email && !validEmail ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid email. example: example@gmail.com{" "}</p>
        </div>

        <div className="ml-2">
          <h1>Phone Number</h1>
          <div className="">
            <PhoneInput
              className=" "
              defaultCountry={"ua"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
            />
          </div>
        </div>

        <div className="form-group p-2">
          {showPassword ? (
            <div className="">
              <label className="flex" htmlFor="password">Password
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-blue-600"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={()=> setPasswordFocus(false)}
                  required
                />
                <div className="absolute top-1 right-5 ">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEye />
                  </button>
                </div>
              </div>
            

            <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>
            </div>
          ) : (
            <div className="">
              <label className="flex" htmlFor="password">Password
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-blue-600"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <div className="absolute top-1 right-5">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEyeSlash />
                  </button>
                </div>
              </div>
              

              <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>          
            </div>
          )}
        </div>

        <div className="ml-2 relative">
          <input
            type="checkbox"
            value={isChecked}
            className="h-5 w-11 mt-2 "
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <h1 className=" text-base md:text-lg lg:text-xl absolute top-1 ml-11 font-medium">
            You accept the <Link to="/termsofuse" className="cursor-pointer font-bold">Terms of service</Link> and{" "}
            <Link to="/privacy" className="cursor-pointer font-bold">Privacy</Link>
          </h1>
        </div>

        <button
          disabled={!validFirstName || !validLastName || !validEmail || !validPassword ? true: false}
          className=" cursor-pointer my-2 mx-4 p-1 mb-2 transition ease-in-out delay-150 duration-300
           w-44 h-11 shadow-lg bg-blue-300 rounded-md hover:scale-103 hover:translate-y-[2px] hover:bg-indigo-500"          >
          Sign Up
        </button>
      </form>
    </div>
    </section>
  );
}

export default Register