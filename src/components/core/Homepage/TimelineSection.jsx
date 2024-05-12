import React from 'react';
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timeLineImage from '../../../assets/Images/TimelineImage.png';

const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        description: "Student will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        description: "Code your way to the solution",
    },
]

const TimelineSection = () => {
  return (
    <div>
        <div className='flex flex-row gap-20 mt-10 items-center'>
            <div className='flex flex-col w-[45%] gap-5'>
                {
                    timeline.map ((element, index) => {
                        return(
                            <div className='flex flex-row gap-10 mt-5' key={index}>
                                <div className='w-[50px] h-[50px] flex items-center '>
                                    <img src={element.Logo} alt=''/>
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200'>
                <img src={timeLineImage} alt="timelineimage" className='shadow-white object-cover h-[500px]'/>
                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-10 
                    left-[50%] translate-x-[-50%] translate-y-[-40%]'>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-400 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>
                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Types of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TimelineSection