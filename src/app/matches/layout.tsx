import type { ReactNode } from 'react';
import React from 'react';


export default function matchesLayout ({children}: { children:ReactNode }):ReactNode {
        return <div>{children}</div>
};