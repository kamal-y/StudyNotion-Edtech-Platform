import React from 'react'
import CTAButton from '../Homepage/Button'
import {HiArrowNarrowRight} from "react-icons/hi";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({position, heading, subHeading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10 `}>

        {/*------------------------- Section-1(left)-----------------------------------  */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>{subHeading}</div>

            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <HiArrowNarrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn2.btnText}
                </CTAButton>
            </div>
        </div>

        {/*--------------------------------- Section-2 (Right)--------------------------------------*/}
        <div className='flex flex-row h-fit text-[15px] w-[100%] py-4 lg:w-[500px]'>
            {/* BG gradient */}
            <div className='text-center flex-flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
                <p>12</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat={Infinity}
                    omitDeletionAnimation
                    style={
                        {
                            whiteSpace: "pre-line",
                            display: "block"
                        }
                    }   
                
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlocks