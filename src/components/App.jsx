import { useState, useEffect } from 'react';

import { Container } from './index.styled';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const notifyInit = Notify.init({
  width: '280px',
  position: 'center-center',
  distance: '20px',
  opacity: 0.8,
  fontSize: '20px',
  borderRadius: '50px 10px',
  notiflixIconColor: 'rgba(0,0,0,0.6)',
  pauseOnHover: true,
});

const INITIAL_STATE = {
  contacts: [
    { id: 'id-1', name: 'Lesya Ukrainka', number: '459-12-56' },
    { id: 'id-2', name: 'Boris JohnsonUK', number: '443-89-12' },
    { id: 'id-3', name: 'Taras Shevchenko', number: '645-17-79' },
    { id: 'id-4', name: 'Crimea BeachClub', number: '227-91-26' },
  ],
  filter: '',
};

export const App = () => {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('contacts')) ?? INITIAL_STATE.contacts
  );
  const [filter, setFilter] = useState(INITIAL_STATE.filter);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    return () => {
      localStorage.removeItem('contacts');
    };
  }, [contacts]);

  const handleAddContact = newContact => {
    const isNameExist = contacts.some(({ name }) => name === newContact.name);
    const isNumberExist = contacts.some(
      ({ number }) => number === newContact.number
    );

    if (isNameExist) {
      Notify.info(
        `${newContact.name} is already in your Contact List!`,
        notifyInit
      );
      return;
    }
    if (isNumberExist) {
      Notify.info(
        `${newContact.number} is already in your Contact List!`,
        notifyInit
      );
      return;
    }
    setContacts(prevContacts => [newContact, ...prevContacts]);
    Notify.success(
      `${newContact.name} added to your Contact List!`,
      notifyInit
    );
  };

  const removeContact = (id, name) => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
    Notify.failure(`${name} removed from your Contact List!`, notifyInit);
  };

  const getFilterContacts = () => {
    return contacts.filter(
      ({ name, number }) =>
        name.toLowerCase().includes(filter.toLowerCase().trim()) ||
        number.includes(filter)
    );
  };

  const handleFilter = ({ target: { value } }) => {
    setFilter(value);
  };

  const filterContacts = getFilterContacts();
  return (
    <Container>
      <h1>Phonebook</h1>
      <ContactForm handleAddContact={handleAddContact} />
      <h2>Contacts</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <ContactList contacts={filterContacts} removeContact={removeContact} />
    </Container>
  );
};
