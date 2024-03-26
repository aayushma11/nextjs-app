
import  React from "react";
import { lusitana } from '@/app/ui/fonts';
import  CommentHeader  from '@/app/ui/comments/commentbox-header';
import  CommentBody  from '@/app/ui/comments/commentbox-body';


export default function Customers(){
    return (
        // <div className="fixed bottom-0 right-0 mb-4 mr-4">
        <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
             <CommentHeader />
            <div id="chatbox" className="p-4 h-80 overflow-y-auto">
                 <CommentBody />
             </div>
        </div>
        // </div>
      )
}