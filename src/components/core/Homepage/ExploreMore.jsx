import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabNames = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths"
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabNames[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);

    }

    return (
        <div>
            <div className='text-4xl font-semibold text-center'>
                Unlock the
                <HighlightText text={"Power of Code"}/>
            </div>
            <p className='text-center text-richblack-300 text-md mt-3'>
                Learn to Build Anything You Can Imagine
            </p>

            <div className='flex flex-row rounded-full bg-richblack-800 mb-5 mt-7 border border-y-richblack-500 border-x-0 border-t-0'>
                {
                    tabNames.map((element, index) => {
                        return(
                            <div className={`text-[16px] flex flex-row items-center gap-2
                                    ${currentTab === element 
                                        ? "bg-richblack-900 text-richblack-5 font-medium" 
                                        : "text-richblack-200 "} 
                                    rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900
                                     hover:text-richblack-5 px-7 py-2`}
                                    key={index}
                                    onClick={() => setMyCards(element)}
                                >
                                {element}
                            </div>
                        )
                    })
                }
            </div>

            <div className='lg:h-[150px]'></div>

            {/* Course Card */}
            <div className='absolute flex flex-row gap-10 justify-between w-full'>
                {
                    courses.map((element, index) => {
                        return(
                            <CourseCard 
                                key={index} 
                                cardData = {element}
                                currentCard = {currentCard}
                                setCurrentCard = {setCurrentCard}    
                            />
                        )
                    })
                }
            </div>    

        </div>
    )
}

export default ExploreMore