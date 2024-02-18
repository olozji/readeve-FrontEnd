'use client'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BookLayoutItem = () => {
    
   
    const [book, setBook] = useState<any>(null);

   

    return (
        <div>
            <div>내 서재</div>
            <p>{}</p>
        </div>
    );
};

export default BookLayoutItem;
