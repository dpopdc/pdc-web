import React, { useState } from 'react';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

import './Input.css';

const Input = props => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className="input">
      <div className='input__header'>
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {props.description && <p className='input__header--description'>{props.description}</p>}
      </div>

      {props.control === 'select' && (
        <select
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          type={props.type}
          id={props.id}
          required={props.required}
          value={props.value}
          placeholder={props.placeholder}
          onChange={e => props.onChange(props.id, e.target.value, props.parent)}
          onBlur={props.onBlur}
        >
          {props.options.map((option) => {
            return (
              <option value={option.value}>{option.label}</option>
            )
          })}
        </select>
      )}
      {props.control === 'textarea' && (
        <textarea
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          id={props.id}
          rows={props.rows}
          required={props.required}
          value={props.value}
          onChange={e => props.onChange(props.id, e.target.value, props.parent)}
          onBlur={props.onBlur}
        />
      )}
      {props.control === 'date' && (
        <input
          type={props.control}
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          id={props.id}
          rows={props.rows}
          required={props.required}
          value={props.value}
          onChange={e => props.onChange(props.id, e.target.value, props.parent)}
          onBlur={props.onBlur}
        />
      )}
      {props.control === 'text' && (
        <input
          type={props.control}
          className={[
            !props.valid ? 'invalid' : 'valid',
            props.touched ? 'touched' : 'untouched'
          ].join(' ')}
          id={props.id}
          required={props.required}
          maxLength={props.settings !== undefined ? props.settings.maxLength : ''}

          value={props.value}
          onChange={e => props.onChange(props.id, e.target.value, props.parent)}
          onBlur={props.onBlur}
        />
      )}
      {props.control === 'password' && (
        <div className='pwd__container'>
          <input
            type={passwordVisible ? 'text' : 'password'}
            className={[
              !props.valid ? 'invalid' : 'valid',
              props.touched ? 'touched' : 'untouched'
            ].join(' ')}
            id={props.id}
            rows={props.rows}
            required={props.required}
            value={props.value}
            onChange={e => props.onChange(props.id, e.target.value, props.parent)}
            onBlur={props.onBlur}
          />
          <span><button onClick={(e) => {
            e.preventDefault()
            setPasswordVisible(!passwordVisible)
          }}>{!passwordVisible ? <RiEyeLine /> : <RiEyeCloseLine />}</button></span>
        </div>
      )}
    </div>
  )
}

export default Input;
