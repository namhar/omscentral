import React, { useContext } from 'react';
import assignDefined from 'src/core/utils/assignDefined';
import {
  usePricingTiersQuery,
  useProgramsQuery,
  UserInputType,
  UserQuery,
  useSpecializationsQuery,
  useUpdateUserMutation,
} from 'src/graphql';

import { AuthContext } from '../Auth';
import { NotificationContext } from '../Notification';
import UserForm from './UserForm';

interface Props {
  user: UserQuery['user'];
}

const UserFormContainer: React.FC<Props> = ({ user }) => {
  const notification = useContext(NotificationContext)!;
  const auth = useContext(AuthContext);
  const mode = auth.user?.uid === user.id ? 'edit' : 'view';

  const [pricingTiers, programs, specializations] = [
    usePricingTiersQuery(),
    useProgramsQuery(),
    useSpecializationsQuery(),
  ];

  const [update, { loading }] = useUpdateUserMutation();

  const handleSubmit = async (data: UserInputType) => {
    try {
      await update({
        variables: {
          user: assignDefined(
            {
              id: user.id,

              auth_provider: user.auth_provider,
              email: user.email,
              name: user.name,
              photo_url: user.photo_url,
              last_signed_in: user.last_signed_in,

              program_id: user.program_id,
              specialization_id: user.specialization_id,
            },
            data,
          ),
        },
      });
      notification.success('User updated.');
    } catch {
      notification.error('Something went wrong.');
    }
  };

  if (
    !pricingTiers.data?.pricingTiers ||
    !programs.data?.programs ||
    !specializations.data?.specializations
  ) {
    return null;
  }

  return (
    <UserForm
      data={{ ...pricingTiers.data, ...programs.data, ...specializations.data }}
      mode={mode}
      user={user}
      disabled={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default UserFormContainer;
