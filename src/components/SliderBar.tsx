import styles from '../styles/components/SliderBar.module.css';
import { Range } from 'react-range';
import { useState } from 'react';

export function SliderBar(props : {range : any, changeRange:any, max:any}) {

  return(
    <Range
        step={0.1}
        min={0}
        max={props.max}
        values={props.range}
        onChange={(values) => props.changeRange(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '4px',
              width: '100%',
              marginTop: '10px',
              marginBottom: '40px',
              backgroundColor: '#908F8F'
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              outline: '  none',
              backgroundColor: '#01CB93'
            }}
          />
        )}
      />
  )
}