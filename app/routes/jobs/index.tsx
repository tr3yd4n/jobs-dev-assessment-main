import React, {useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import type { LoaderFunction } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';
import { getJobListItems } from '~/models/job.server';
import { json } from '@remix-run/node';
import { CatchValue } from '@remix-run/react/dist/transition';
import { Value } from '@prisma/client/runtime';

type LoaderData = {
  jobs: Awaited<ReturnType<typeof getJobListItems>>;
};

export const loader: LoaderFunction = async () => {
  const jobs = await getJobListItems()
  return json<LoaderData>({ jobs })
  
};



export default function JobsIndexPage({}): JSX.Element {
  const data = useLoaderData<LoaderData>()
  const [currentJobs, setCurrentJobs] = useState([data.jobs])
  const [pageCount, setPageCount] = useState(1)
  const [itemOffset, setItemOffset] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  
   
  useEffect(
    () => {
      const endOffset = itemOffset + itemsPerPage
      const newSetJobs = data.jobs.slice(itemOffset, endOffset)
      setCurrentJobs(newSetJobs)
      setPageCount(Math.ceil([...data.jobs].length / itemsPerPage))
    }, [itemOffset, itemsPerPage]
  )
      
  const buttonArray = []
      for (let i = 0; i < pageCount; i++) {
    buttonArray.push(i)
  }
  
  const jobsPerPageSelected = (_e) => {        
    setItemsPerPage(_e.value)
    const newOffset = (_e.value * itemsPerPage) % currentJobs.length
    setItemOffset(newOffset)
  }

  const incremeantJobs = (pageNumber: number) =>{
    const startOfIndex = (itemsPerPage * pageNumber) - itemsPerPage
    const endOfIndex = (itemsPerPage * pageNumber) - 1 
    const newSetJobs = data.jobs.slice(startOfIndex, endOfIndex)
    setCurrentJobs(newSetJobs)
    
  } 

  return(
    <>
      <div className='flex flex-wrap gap-8 p-8 flex justify-center flex space-x-2'> 
        <div>Jobs per page</div>
        <div className='flex flex-wrap gap-8 justify-center'>
        <button className='border-color: rgb(0 0 0); border-radius: 1rem; /* 16px */ margin-left: 0.25rem; /* 4px */'  value= '5' onClick={_e =>  jobsPerPageSelected(_e.target)}>5</button>
        <button className='color: rgb(155 155 555)' value='10' onClick={_e =>  jobsPerPageSelected(_e.target)}>10</button>
        <button value='30' onClick={_e =>  jobsPerPageSelected(_e.target)}>30</button>        
        </div>
      </div>

      <div className='flex flex-wrap gap-4 p-8 flex justify-center flex space-x-4'> 
        {currentJobs.map((job) => (
        <div className='card w-96 bg-base-300 shadow-xl'>
          <img alt={'image not found'}/>
          <div className="text-xl">{job.title}</div>
          <div>
          <div>{job.description} - {job.location} - {job.contractType}</div>
          
          </div>
          
          
          
          {/* <div>{job.createdAt}</div> */}
          <div className='mt-4 flex gap-4'>
              <a href={`/jobs/${job.id}`} className='btn btn-secondary flex-1'>
                Details
              </a>
              <a href={`/jobs/${job.id}/apply`} className='btn btn-primary flex-1'>
                Apply
              </a>
          </div>
         
          
        </div>))}
      </div>
        
      <div className='flex flex-wrap gap-10 p-8 flex justify-center'>  
        {buttonArray.map((button) =>(
            <button key={button} value={button} onClick = {() => incremeantJobs(button)}>
              {button}
            </button>
           
        ))}
      </div>
    
    </>
    
  )
}

  


      




  
  


  