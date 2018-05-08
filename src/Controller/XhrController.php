<?php

namespace Drupal\syncflag\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\user\Entity\User;

/**
 * Class XhrController.
 */
class XhrController extends ControllerBase {

  /**
   * Xhr.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   JSON Response.
   */
  public function xhr() {
    $config = \Drupal::service('config.factory')->getEditable('syncflag.settings');
    $user = User::load(\Drupal::currentUser()->id());
    $params = \Drupal::request()->query->all();

    if (empty($params['c'])) {
      $params['c'] = 'view';
    }
    $command = $params['c'];
    $status = $config->get('flag');
    if ($status === NULL) {
      $status = 1;
    }
    switch ($command) {
      case 'view':
        break;

      case 'toggle':
        if ($user->id() == 1 || $user->hasRole('administrator')) {
          $new_status = $status ? 0 : 1;
          $config->set('flag', $new_status)->save();
          $status = $new_status;
        }
        break;
    }
    $data = ['s' => $status];

    return new JsonResponse($data);
  }

}
