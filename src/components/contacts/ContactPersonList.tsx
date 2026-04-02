import type { ContactPersonListItemDto } from "../../features/contactPersons/contactPersonsAPI";

interface ContactPersonListProps {
  contactPersons: ContactPersonListItemDto[];
}

export const ContactPersonList: React.FC<ContactPersonListProps> = ({
  contactPersons,
}) => {
  const contacts = contactPersons || [];

  return (
    <div>
      {contacts.length > 0 ? (
        <div className="space-y-2">
          {contacts.map((person) => (
            <div
              key={person.id}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {person.name}
              </div>
              {person.position && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {person.position}
                </div>
              )}
              {person.email && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {person.email}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">
          No contact persons available.
        </div>
      )}
    </div>
  );
};
