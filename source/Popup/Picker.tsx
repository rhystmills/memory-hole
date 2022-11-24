import React, {ReactElement, useState} from 'react';

const AddIcon = (): ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path d="M21.65 38.85v-12.5H9.15v-4.7h12.5V9.15h4.7v12.5h12.5v4.7h-12.5v12.5Z" />
  </svg>
);

export const Picker = ({
  addToBlocked,
}: {
  addToBlocked: (str: string) => void;
}): ReactElement => {
  const [inputValue, setInputValue] = useState('');

  const attemptToBlock = (toBlock: string): void => {
    console.log(`Attempting to block ${toBlock}`);
    addToBlocked(toBlock);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    attemptToBlock(inputValue);
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <form className="picker" onSubmit={handleInputSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        id="subject"
        name="subject"
        placeholder="Enter text to block..."
        minLength={1}
        maxLength={32}
        size={10}
      />
      <button type="button" onClick={(): void => attemptToBlock(inputValue)}>
        <AddIcon />
      </button>
    </form>
  );
};
