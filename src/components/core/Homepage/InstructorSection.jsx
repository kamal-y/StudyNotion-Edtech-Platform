import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from '../Homepage/Button'
import Instructor from '../../../assets/Images/Instructor.png'
import { HiArrowNarrowRight } from 'react-icons/hi'

const InstructorSection = () => {
  return (
    <div>
        <div className='flex items-center gap-x-32'>
          <div className='text-white'>
            <img className='h-[500px]' src={Instructor} alt='' />  
          </div>

          <div className='flex flex-col w-[36%] gap-5'>
            <div className='text-4xl font-semibold'>
              Become an <HighlightText text={"instructor"} />
            </div>
            <div>
              Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </div>
            <div className='flex w-fit'>
              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-3'>
                  Start Teaching Today <HiArrowNarrowRight/>
                </div>
              </CTAButton>
            </div> 
          </div>
        </div>
    </div> 
  )
}

export default InstructorSection