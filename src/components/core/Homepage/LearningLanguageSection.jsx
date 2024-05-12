import React from 'react'
import HighlightText from './HighlightText'
import KnowYourProgress from '../../../assets/Images/Know_your_progress.png';
import CompareWithOthers from '../../../assets/Images/Compare_with_others.png';
import PlanYourLessons from '../../../assets/Images/Plan_your_lessons.png';
import CTAButton from '../Homepage/Button';

const LearningLanguageSection = () => {
  return (
    <div className='mt-[150px]'>
        <div className='flex flex-col gap-5'>
            <div className='text-4xl font-semibold text-center '>
                Your swiss knife for <HighlightText text={"learning and language"}/>
            </div>
            <div className='text-center text-richblack-600 mx-auto text-[15px] mt-1 w-[65%]'>
                Using spin making learning multiple languages easy, with 20+ languages realistic voice-over, making progress 
                tracking, custom schedule and more. 
            </div>

            <div className='flex flex-row items-center justify-center mt-5'>
                <img src={KnowYourProgress} alt='Know_Your_Progress' className='object-contain -mr-32' />
                <img src={CompareWithOthers} alt='Compare_With_Others' className='object-contain' />
                <img src={PlanYourLessons} alt='Plan_Your_Yessons' className='object-contain -ml-36'/>
            </div>

            <div className='w-fit mx-auto mt-7 mb-[90px]'>
                <CTAButton active={true} linkto={'/signup'}>Learn more</CTAButton>
            </div>
        </div>


    </div>
  )
}

export default LearningLanguageSection