import React from 'react'
import { Link } from 'react-router-dom'
import {HiArrowNarrowRight} from "react-icons/hi";
import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import TimelineSection from '../components/core/Homepage/TimelineSection';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';

import InstructorSection from '../components/core/Homepage/InstructorSection';
import Footer from '../components/Common/Footer';
import ExploreMore from '../components/core/Homepage/ExploreMore';


const Home = () => {
  return (
    <div className=''>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between '>
        <Link to={"/signup"}>

          <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all
           duration-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all
             duration-200 group-hover:bg-richblack-900 '>
              <p>Become an Instructor</p>
              <HiArrowNarrowRight/>
            </div>
          </div>

        </Link>

        {/*--------- Heading */}
        <div className='text-center text-3xl font-semibold mt-7'>
          Empower Your Future Growth with 
          <HighlightText text={"Coding Skills"}/>
        </div>

         {/* -----------Subheading */}
        <div className='w-[90%] mt-2 items-center text-center mx-auto text-[14px] font-bold text-richblack-300'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a 
          wealthy of resourses, including hands-on-project, quizzes and personalized feedback from instructor.
        </div>

        {/*--------- Reusabel Components(Button)---------------- */}
        <div className='flex flex-row mx-auto gap-7 mt-8 ml-[40%]'>
          <CTAButton active={true} linkto={"/signup"}>Learn More </CTAButton>
          <CTAButton active={false} linkto={"/login"}>Book Demo</CTAButton>
        </div>

        {/* Adding Video */}
        <div className='shadow-blue-200 mx-3 my-12'>
          <video muted loop autoPlay >
            <source src={Banner} type='video/mp4'/>
          </video>
        </div>

          {/* Code Section 1 */}
        <div>

          <div> 
            <CodeBlocks
              position={`lg:flex-row`}
              heading={
                  <div className='text-4xl font-semibold'>
                    Unlock your <HighlightText text={`coding potential`}/> with our online courses.
                  </div>
                }

              subHeading={`Our course are designed and taught by industry experts who have years of experience
               in coding and passionate about sharing their knowledge with you.`}

              ctabtn1={
                {
                  btnText: "Try it Yourself",
                  linkto: "/signup",
                  active: true
                }
              }
              ctabtn2={
                {
                  btnText: "Learn more",
                  linkto: "/login",
                  active: false
                }
              }

              codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>Example</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="/one">One</a><a href="/two">Two</a></nav>\n</body>\n</html>`}
              codeColor={"text-yellow-25"}
            />
          </div>

        </div>
        
          {/* Code section 2 */}
          <div>

          <div> 
            <CodeBlocks
              position={`lg:flex-row-reverse`}
              heading={
                  <div className='text-4xl font-semibold'>
                    Start <HighlightText text={`coding\nin second`}/>.
                  </div>
                }

              subHeading={`Go ahead, give it a try.Our hands-on learning environment means you'll be writing real code from your very first lesson`}

              ctabtn1={
                {
                  btnText: "Continue Lesson",
                  linkto: "/signup",
                  active: true
                }
              }
              ctabtn2={
                {
                  btnText: "Learn more",
                  linkto: "/login",
                  active: false
                }
              }

              codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>Example</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="/one">One</a><a href="/two">Two</a></nav>\n</body>\n</html>`}
              codeColor={"text-yellow-25"}
            />
          </div>

        </div>

        <ExploreMore/>
      </div>

      {/*Section 2  */}
      <div className='w-[100%] bg-pure-greys-5 text-richblack-700'>

        {/*  */}
        <div className='homepage_bg  h-[310px]'>
          <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
          <div className='h-[150px]'></div>
              <div className='flex flex-row gap-7 text-white'>
                <CTAButton linkto={"/signup"} active={true}>
                  <div className='flex gap-3 items-center'>
                    Explore Full Catalog <HiArrowNarrowRight/>
                  </div>
                </CTAButton>
                <CTAButton linkto={"/login"} active={false}>
                  <div>Learn more</div>
                </CTAButton>
              </div>
          </div>
        </div>

        {/*  */}
        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
          <div className='flex flex-row gap-14 mb-10 mt-[95px]'> 
            <div className='text-4xl font-semibold w-[45%]'>
              Get the skills you need for the <HighlightText text={"job that is in demand."}/> 
            </div>
            <div className='flex flex-col gap-10 w-[40%] items-start'>
              <div className='text-[16px]'>
                The modern StudyNotion is the dedicates its own terms. Today to be
                 a Competitive Specialist requires more than prefessional skills.  
              </div>
              <CTAButton active={true} linkto={"/signup"}>Learn more</CTAButton>
            </div>
          </div>

          <TimelineSection></TimelineSection>

          <LearningLanguageSection></LearningLanguageSection>

        </div>

      </div>

      {/* Section 3 */}
      <div className='mx-auto w-11/12 text-white max-w-maxContent flex flex-col items-center justify-between gap-7 mt-[100px]'>


        <InstructorSection></InstructorSection>

        <div>
          <h2 className='text-4xl font-semibold mt-20 text-center'>Review from Other Learner</h2>
        </div>

        {/* Review Slider */}
      </div>

      {/* Footer */}
      <Footer/> 


    </div>
  )
}

export default Home

