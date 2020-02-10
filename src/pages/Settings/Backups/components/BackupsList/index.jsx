import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import { Alert, Table } from 'reactstrap';

import Button from '@/components/LegacyButton';
import { Spinner } from '@/components/Spinner';

function BackupsList({ loading, versions, live_version, live_version_id, confirmRestore }) {
  if (loading) {
    return <Spinner name="Backup Versions" />;
  }

  if ((!Array.isArray(versions) || versions.length === 0) && !live_version) {
    return (
      <Alert color="warning">
        There are currently no backups for this skill
        <br />
        Backups are generated every time when you upload your skill
      </Alert>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Saved</th>
          <th>Platform</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {live_version ? (
          <tr className="table-primary">
            <td>
              {moment(live_version.created).fromNow()} <br /> (Current live version)
            </td>
            <td>
              <i
                className={cn('fab', {
                  'fa-google': live_version.published_platform === 'google',
                  'fa-amazon': live_version.published_platform !== 'google',
                })}
              />
            </td>
            <td className="text-right">
              <Button isPrimary onClick={() => confirmRestore(live_version_id)}>
                Restore
              </Button>
            </td>
          </tr>
        ) : null}
        {versions.map((version, i) => {
          return (
            <tr key={i}>
              <td>{moment(version.created).fromNow()}</td>
              <td>
                <i
                  className={cn('fab', {
                    'fa-google': version.published_platform === 'google',
                    'fa-amazon': version.published_platform !== 'google',
                  })}
                />
              </td>
              <td className="text-right">
                <Button isPrimarySmall onClick={() => confirmRestore(version.skill_id)}>
                  Restore
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default BackupsList;
